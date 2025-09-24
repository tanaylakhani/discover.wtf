// pages/api/link.ts

import { db } from "@/lib/db";
import { commentLikes } from "@/lib/db/schema";
import { ErrorWithStatus, options } from "@/lib/utils";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const commentId = request?.nextUrl?.searchParams.get("commentId") as string;
    const userId = request?.headers.get("x-user-id") as string;
    const { liked }: { liked: boolean } = await request.json();

    if (!commentId)
      throw new ErrorWithStatus("CommentId was not provided", 404);

    if (liked) {
      await db
        .insert(commentLikes)
        .values({
          commentId: commentId,
          userId: userId,
        })
        .onConflictDoNothing({
          target: [commentLikes.userId, commentLikes.commentId],
        });
    } else {
      await db
        .delete(commentLikes)
        .where(
          and(
            eq(commentLikes.commentId, commentId),
            eq(commentLikes.userId, userId)
          )
        );
    }
    return NextResponse.json(
      {
        success: true,
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
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
        error: (error as Error).message || "Failed to insert like",
      },
      { status: 500, headers: options }
    );
  }
}
