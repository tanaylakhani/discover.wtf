// pages/api/bookmark.ts

import { db } from "@/lib/db";
import { bookmarks } from "@/lib/db/schema";
import { ErrorWithStatus, options } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Getting LinkId from Query Parameters
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    const userId = request.headers.get("x-user-id") as string;
    if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);

    const isBookmarked = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.linkId, linkId),
          eq(bookmarks.userId, userId as string)
        )
      );

    return NextResponse.json(
      {
        data: {
          bookmarked: isBookmarked?.length > 0,
        },
        success: true,
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error("Error in insert bookmark:", error);
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
        error: (error as Error).message || "Failed to insert bookmark",
      },
      { status: 500, headers: options }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    // Getting LinkId from Query Parameters
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    const userId = request.headers.get("x-user-id") as string;
    const { bookmarked }: { bookmarked: boolean } = await request.json();
    if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);

    if (bookmarked) {
      await db
        .insert(bookmarks)
        .values({
          linkId: linkId,
          userId: userId,
        })
        .onConflictDoUpdate({
          target: [bookmarks.linkId, bookmarks.userId],
          set: {
            bookmarkedAt: new Date(),
          },
        });
    } else {
      await db
        .delete(bookmarks)
        .where(and(eq(bookmarks.linkId, linkId), eq(bookmarks.userId, userId)));
    }

    return NextResponse.json(
      {
        success: true,
        data: { bookmarked },
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error("Error in insert bookmark:", error);
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
        error: (error as Error).message || "Failed to insert bookmark",
      },
      { status: 500, headers: options }
    );
  }
}
// export async function DELETE(request: NextRequest) {
//   try {
//     const userId = request.headers.get("x-user-id") as string;
//     const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
//     if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);

//     await db
//       .delete(bookmarks)
//       .where(and(eq(bookmarks.linkId, linkId), eq(bookmarks.userId, userId)));

//     return NextResponse.json(
//       {
//         success: true,
//         error: null,
//       },
//       { status: 200, headers: options }
//     );
//   } catch (error) {
//     console.error("Error in delete bookmark:", error);
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
//         error: (error as Error).message || "Failed to fetch links",
//       },
//       { status: 500, headers: options }
//     );
//   }
// }
