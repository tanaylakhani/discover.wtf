// pages/api/link.ts

import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { ErrorWithStatus, options } from "@/lib/utils";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    const userId = request?.headers.get("x-user-id") as string;

    if (!linkId || !userId)
      throw new ErrorWithStatus("LinkId or UserId was not provided", 404);

    const likedRow = await db
      .select()
      .from(likes)
      .where(and(eq(likes.linkId, linkId), eq(likes.userId, userId)));

    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(eq(likes.linkId, linkId))
      .then((res) => res[0].count);
    return NextResponse.json(
      {
        success: true,
        error: null,
        data: {
          liked: likedRow.length > 0,
          count,
        },
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
        error: (error as Error).message || "Failed to insert like",
      },
      { status: 500, headers: options }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    const userId = request?.headers.get("x-user-id") as string;
    const { liked }: { liked: boolean } = await request.json();

    if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);

    if (liked) {
      await db
        .insert(likes)
        .values({
          linkId: linkId,
          userId: userId,
        })
        .onConflictDoNothing({ target: [likes.userId, likes.linkId] });
    } else {
      await db
        .delete(likes)
        .where(and(eq(likes.linkId, linkId), eq(likes.userId, userId)));
    }
    return NextResponse.json(
      {
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
        error: (error as Error).message || "Failed to insert like",
      },
      { status: 500, headers: options }
    );
  }
}
