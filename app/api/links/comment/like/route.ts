// pages/api/link.ts

import { db } from "@/lib/db";
import { commentLikes } from "@/lib/db/schema";
import { ErrorWithStatus, options } from "@/lib/utils";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   try {
//     const commentId = request?.nextUrl?.searchParams.get("commentId") as string;
//     const userId = request?.headers.get("x-user-id") as string;

//     if (!commentId || !userId)
//       throw new ErrorWithStatus("CommentId or UserId was not provided", 404);

//     const likedRow = await db
//       .select()
//       .from(commentLikes)
//       .where(
//         and(
//           eq(commentLikes.commentId, commentId),
//           eq(commentLikes.userId, userId)
//         )
//       );

//     const count = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(commentLikes)
//       .where(eq(commentLikes.commentId, commentId))
//       .then((res) => res[0].count);

//     console.log({ count, likedRow });
//     return NextResponse.json(
//       {
//         success: true,
//         error: null,
//         data: {
//           liked: likedRow.length > 0,
//           count,
//         },
//       },
//       { status: 200, headers: options }
//     );
//   } catch (error) {
//     console.error("Error in insert bookmark:", error);
//     if (error instanceof ErrorWithStatus) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: error.message,
//         },
//         { status: error.status, headers: options }
//       );
//     }
//     return NextResponse.json(
//       {
//         success: false,
//         error: (error as Error).message || "Failed to insert like",
//       },
//       { status: 500, headers: options }
//     );
//   }
// }
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
    console.error("Error in insert like:", error);
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
