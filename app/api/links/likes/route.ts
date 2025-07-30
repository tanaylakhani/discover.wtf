import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { linkId: string; userId: string } }
) {
  try {
    const { linkId, userId } = params;

    // Get total likes count
    const [{ count: likesCount }] = await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.linkId, linkId));

    return NextResponse.json({
      count: likesCount,
      linkId,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { linkId: string; userId: string } }
) {
  try {
    // Get current user from BetterStacks (via your auth token)

    const { linkId, userId } = params;

    // Check if like already exists
    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.linkId, linkId), eq(likes.userId, userId)))
      .limit(1);

    if (existingLike.length > 0) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }

    // Add like
    await db.insert(likes).values({
      linkId,
      userId: userId, // BetterStacks user ID
    });

    // Get updated count
    const [{ count: likesCount }] = await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.linkId, linkId));

    return NextResponse.json({
      success: true,
      count: likesCount,
    });
  } catch (error) {
    console.error("Error adding like:", error);
    return NextResponse.json({ error: "Failed to add like" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { linkId: string; userId: string } }
) {
  try {
    const { linkId, userId } = params;

    // Remove like
    await db
      .delete(likes)
      .where(and(eq(likes.linkId, linkId), eq(likes.userId, userId)));

    // Get updated count
    const [{ count: likesCount }] = await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.linkId, linkId));

    return NextResponse.json({
      success: true,
      count: likesCount,
    });
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json(
      { error: "Failed to remove like" },
      { status: 500 }
    );
  }
}
