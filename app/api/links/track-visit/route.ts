import { createApolloClient, PublicRandomLink } from "@/lib/apollo";
import { db } from "@/lib/db";
import { userLinkVisits } from "@/lib/db/schema";
import { PUBLIC_LINKS_QUERY } from "@/lib/graphql/links";
import { ErrorWithStatus, options } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Getting LinkId from Query Parameters
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    const userId = request?.headers.get("x-user-id") as string;
    console.log({ userId, linkId });
    if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);

    await db
      .insert(userLinkVisits)
      .values({
        linkId,
        userId,
      })
      .onConflictDoNothing();

    return NextResponse.json(
      {
        success: true,
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error("Error in track visit:", error);
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
        error: (error as Error).message || "Failed to fetch links",
      },
      { status: 500, headers: options }
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    // Getting LinkId from Query Parameters
    const userId = request?.headers.get("x-user-id") as string;
    const token = request?.headers.get("token") as string;
    console.log({ userId });
    const visitedIds = await db
      .select({
        linkId: userLinkVisits.linkId,
      })
      .from(userLinkVisits)
      .where(eq(userLinkVisits.userId, userId))
      .orderBy(desc(userLinkVisits?.visitedAt))
      .limit(10);

    const visitedSet = new Set([...visitedIds.map((v) => v.linkId)]);
    console.log({ visitedIds });

    if (!visitedIds || visitedIds.length === 0) {
      console.log("No visited links found for user");
      return NextResponse.json(
        {
          success: true,
          data: [],
          error: null,
        },
        { status: 200, headers: options }
      );
    }

    const client = createApolloClient(token);

    const data = await client.query({
      query: PUBLIC_LINKS_QUERY,
      variables: { ids: Array.from(visitedSet) },
    });
    // console.log({ data });
    if (data?.errors && data.errors.length > 0) {
      console.error("GraphQL errors:", data.errors);
      throw new ErrorWithStatus(
        data?.errors?.map((err) => err.message).join(", "),
        400
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data?.data?.public_links as PublicRandomLink[],
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error("Error in track visit:", error);
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
        error: (error as Error).message || "Failed to fetch links",
      },
      { status: 500, headers: options }
    );
  }
}
