// pages/api/bookmark.ts

import { db } from "@/lib/db";
import {
  commentMedia,
  comments,
  commentLikes,
  TCommentAuthor,
} from "@/lib/db/schema";
import supabase from "@/lib/supabase";
import { ErrorWithStatus, options } from "@/lib/utils";
import { and, desc, eq, getTableColumns, isNull, sql, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Getting LinkId from Query Parameters
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);

    // Get userId from header for liked field
    const userId = request?.headers.get("x-user-id") as string | undefined;

    // Get sort option from query (?sort=newest|oldest|top)
    const sort = request?.nextUrl?.searchParams.get("sort") || "newest";

    const { ...rest } = getTableColumns(comments);
    // For 'top', count number of replies for each comment
    const replyCountSql = sql<number>`(
      SELECT COUNT(*) FROM ${comments} c2 WHERE c2.parent_id = ${comments.id}
    )`;
    // Like count for each comment
    const likeCountSql = sql<number>`(
      SELECT COUNT(*) FROM ${commentLikes} cl WHERE cl.comment_id = ${comments.id}
    )`;
    // Whether this user liked the comment
    const likedSql = userId
      ? sql<boolean>`EXISTS(SELECT 1 FROM ${commentLikes} cl WHERE cl.comment_id = ${comments.id} AND cl.user_id = ${userId})`
      : sql<boolean>`false`;

    let orderByClause;
    if (sort === "oldest") {
      orderByClause = asc(comments.commentedAt);
    } else if (sort === "top" || sort === "most-replied") {
      orderByClause = [
        sql`(${replyCountSql}) DESC`,
        desc(comments.commentedAt),
      ];
    } else if (sort === "least-replied") {
      orderByClause = [sql`(${replyCountSql}) ASC`, desc(comments.commentedAt)];
    } else {
      // default: newest
      orderByClause = desc(comments.commentedAt);
    }

    const linkComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        userId: comments.userId,
        linkId: comments.linkId,
        commentedAt: comments.commentedAt,
        user: comments.user,
        isPrivate: comments.isPrivate,

        media: sql<Array<{
          id: string;
          url: string;
          type: string;
          createdAt: Date;
        }> | null>`
      CASE 
        WHEN COUNT(${commentMedia.id}) = 0 THEN NULL
        ELSE json_agg(
          json_build_object(
            'id', ${commentMedia.id},
            'url', ${commentMedia.url},
            'type', ${commentMedia.type},
            'createdAt', ${commentMedia.createdAt}
          )
        ) FILTER (WHERE ${commentMedia.id} IS NOT NULL)
      END
    `,

        // 👇 replies aggregated inline
        replies: sql<Comment[] | null>`
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'id', c2.id,
              'content', c2.content,
              'userId', c2.user_id,
              'linkId', c2.link_id,
              'commentedAt', c2.commented_at,
              'user', c2.user,
              'isPrivate', c2.is_private
            )
          ), '[]'::json
        )
        FROM ${comments} c2
        WHERE c2.parent_id = ${comments.id}
      )
    `,
        replyCount: replyCountSql,
        likeCount: likeCountSql,
        liked: likedSql,
      })
      .from(comments)
      .leftJoin(commentMedia, eq(comments.id, commentMedia.commentId))
      .where(and(eq(comments.linkId, linkId), isNull(comments.parentId))) // only top-level
      .groupBy(comments.id)
      .orderBy(
        ...(Array.isArray(orderByClause) ? orderByClause : [orderByClause])
      );

    return NextResponse.json(
      {
        comments: linkComments,
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error("Error in comment:", error);
    if (error instanceof ErrorWithStatus) {
      return NextResponse.json(
        {
          comments: null,
          error: error.message,
        },
        { status: error.status, headers: options }
      );
    }
    return NextResponse.json(
      {
        comments: null,
        error: (error as Error).message || "Failed to get comment",
      },
      { status: 500, headers: options }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extracting Token from Header
    const token = request.headers.get("token");
    const userId = request.headers.get("x-user-id");
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      throw new ErrorWithStatus("Invalid content type", 400);
    }
    if (!token) throw new ErrorWithStatus("Unauthorized", 401);

    // Getting LinkId from Query Parameters
    if (!linkId || !userId)
      throw new ErrorWithStatus("LinkId or UserId was not provided", 404);

    const formData = await request.formData();
    const content = formData.get("content") as string;
    const fileData = formData.get("file");
    const userValue = formData.get("user");
    const parentId = formData.get("parentId") as string | null;
    const user: TCommentAuthor | null =
      typeof userValue === "string"
        ? (JSON.parse(userValue) as TCommentAuthor)
        : null;
    console.log({ content, fileData, user });

    // const result = await db.transaction(async (tx) => {
    // 1. Insert comment
    const [createdComment] = await db
      .insert(comments)
      .values({
        userId,
        linkId,
        content,
        user: user as TCommentAuthor,
        parentId: parentId || null,
      })
      .returning();

    let mediaUrl: { url: string; type: string }[] | null = null;

    // 2. If file exists, upload to Supabase and insert into comment_media
    if (fileData && fileData instanceof File) {
      const ext = fileData.name.split(".").pop(); // e.g. "png" or "jpg"
      const path = `file-${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("discover.wtf")
        .upload(path, fileData, {
          contentType: fileData.type,
          cacheControl: "3600",
          upsert: false,
          metadata: {
            userId: userId,
            linkId: linkId,
          },
        });
      console.log({ data, error });
      if (error) {
        throw new ErrorWithStatus(`Upload failed: ${error.message}`, 500);
      }
      const { data: publicData } = supabase.storage
        .from("discover.wtf")
        .getPublicUrl(data.path);

      console.log("PublicUrl: ", publicData?.publicUrl);

      const payload = {
        url: publicData?.publicUrl as string,
        type: fileData?.type.startsWith("image/") ? "image" : "video",
      };
      await db.insert(commentMedia).values({
        commentId: createdComment.id,
        ...payload,
      });
      mediaUrl = [...(mediaUrl || []), payload];
    }

    return NextResponse.json(
      {
        success: true,
        comment: {
          ...createdComment,
          ...(mediaUrl && { media: [...mediaUrl] }),
        },
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error("Error in comment:", error);
    if (error instanceof ErrorWithStatus) {
      return NextResponse.json(
        {
          success: false,
          comment: null,
          error: error.message,
        },
        { status: error.status, headers: options }
      );
    }
    return NextResponse.json(
      {
        success: false,
        comment: null,

        error: (error as Error).message || "Failed to insert comment",
      },
      { status: 500, headers: options }
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const commentId = request?.nextUrl?.searchParams.get("commentId") as string;
    const userId = request.headers.get("x-user-id") as string;
    if (!commentId)
      throw new ErrorWithStatus("CommentId was not provided", 404);

    await db
      .delete(comments)
      .where(and(eq(comments.userId, userId), eq(comments.id, commentId)));

    return NextResponse.json(
      {
        success: true,
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error("Error in delete comment:", error);
    if (error instanceof ErrorWithStatus) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.status, headers: options }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Failed to delete comment",
      },
      { status: 500, headers: options }
    );
  }
}
