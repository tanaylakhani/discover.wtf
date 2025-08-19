// pages/api/bookmark.ts

import { createApolloClient } from "@/lib/apollo";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { LinkItem, MUTATION_CREATE_MULTIPLE_LINKS } from "@/lib/graphql/links";
import {
  ErrorWithStatus,
  getUserId,
  options,
  PublicRandomLink,
} from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Extracting Token from Header
    const token = request.headers.get("token") as string;
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;

    if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);
    // Getting LinkId from Query Parameters

    const { links }: { links: PublicRandomLink[] } = await request.json();
    const body = await request.json();
    if (!body?.url) throw new ErrorWithStatus("URL was not provided", 404);

    const client = createApolloClient(token);

    const { data, errors } = await client.mutate({
      mutation: MUTATION_CREATE_MULTIPLE_LINKS(),
      variables: {
        links: links?.map((link) => ({
          url: link.target_url,
          title: `${link?.title} | Discover.wtf` || "Saved from Discover.wtf",
          description: link.description || "Saved from Discover.wtf",
          created_at: new Date().toString(),
          domain: link?.domain || "No domain",
          updated_at: new Date().toString(),
          image_url: link?.screenshot_url || null,
          id: link?.id,
          target_url: link?.target_url,
          favicon_url: link?.favicon_url as string,
        })) as LinkItem[],
      },
    });

    if (errors && errors?.length > 0) {
      throw new ErrorWithStatus(
        errors.map((err) => err.message).join(", "),
        500
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data,
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
          data: null,
          error: error.message,
        },
        { status: error.status, headers: options }
      );
    }
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: (error as Error).message || "Failed to insert like",
      },
      { status: 500, headers: options }
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    // Getting Token from Header
    const token = request.headers.get("token") as string;

    // Getting LinkId from Query Parameters
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);

    const client = createApolloClient(token);

    // Getting UserId from Token
    const { id } = await getUserId(client);
    if (!id) throw new ErrorWithStatus("User not found", 404);

    await db
      .delete(likes)
      .where(and(eq(likes.linkId, linkId), eq(likes.userId, id)));

    return NextResponse.json(
      {
        success: true,
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error("Error in delete like:", error);
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
        error: (error as Error).message || "Failed to delete likes",
      },
      { status: 500, headers: options }
    );
  }
}
