// pages/api/bookmark.ts

import { createApolloClient } from "@/lib/apollo";
import { db } from "@/lib/db";
import { commentMedia, comments, TCommentAuthor } from "@/lib/db/schema";
import { QUERY_USER, User } from "@/lib/graphql/user";
import supabase from "@/lib/supabase";
import { ErrorWithStatus, options } from "@/lib/utils";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Getting LinkId from Query Parameters
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);

    const { ...rest } = getTableColumns(comments);
    const linkComments = await db
      .select({
        ...rest,
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
      })
      .from(comments)
      .leftJoin(commentMedia, eq(comments.id, commentMedia.commentId))
      .where(eq(comments.linkId, linkId))
      .groupBy(
        comments.id,
        comments.userId,
        comments.linkId,
        comments.content,
        comments.commentedAt
      )
      .orderBy(desc(comments.commentedAt));

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
    const file = formData.get("file") as File | null;
    const userValue = formData.get("user");
    const user: TCommentAuthor | null =
      typeof userValue === "string"
        ? (JSON.parse(userValue) as TCommentAuthor)
        : null;
    console.log({ content, file, user });

    // const result = await db.transaction(async (tx) => {
    // 1. Insert comment
    const [createdComment] = await db
      .insert(comments)
      .values({
        userId,
        linkId,
        content,
        user: user as TCommentAuthor,
      })
      .returning();

    let mediaUrl: { url: string; type: string }[] | null = null;

    // 2. If file exists, upload to Supabase and insert into comment_media
    if (file) {
      const { data, error } = await supabase.storage
        .from("discover-media")
        .upload(`${file.name}-${new Date().getTime()}`, file, {
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
        .from("discover-media")
        .getPublicUrl(data.path);

      const payload = {
        url: publicData?.publicUrl as string,
        type: file?.type.startsWith("image/") ? "image" : "video",
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
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    const commentId = request?.nextUrl?.searchParams.get("commentId") as string;
    const userId = request.headers.get("x-user-id") as string;
    if (!linkId || !commentId)
      throw new ErrorWithStatus("LinkId or CommentId was not provided", 404);

    await db
      .delete(comments)
      .where(
        and(
          eq(comments.linkId, linkId),
          eq(comments.userId, userId),
          eq(comments.id, commentId)
        )
      );

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
