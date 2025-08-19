import { createApolloClient, PublicRandomLink } from "@/lib/apollo";
import { PUBLIC_RANDOM_LINKS_QUERY } from "@/lib/graphql/links";
import { ErrorWithStatus, options } from "@/lib/utils";
import { ApolloError } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204, headers: options });
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("token");
    console.log({ token });
    if (!token) throw new ErrorWithStatus("Unauthorized", 401);
    const client = createApolloClient(token);

    const data = await client.query({
      query: PUBLIC_RANDOM_LINKS_QUERY,
      variables: { limit: 100 },
    });
    console.log({ data: data });
    const randomLinks =
      (data?.data?.public_random_links as PublicRandomLink[]) || [];

    if (randomLinks.length === 0) {
      throw new ErrorWithStatus("No random links found", 404);
    }

    return NextResponse.json(
      {
        random_links: randomLinks,
        success: true,
        error: null,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error(
      "Error fetching random links:",
      (error as ApolloError)?.message
    );
    if (error instanceof ErrorWithStatus) {
      return NextResponse.json(
        {
          random_links: null,
          success: false,
          error: error.message,
        },
        { status: error.status, headers: options }
      );
    }
    return NextResponse.json(
      {
        random_links: null,
        success: false,
        error: "Failed to fetch random links",
      },
      { status: 500, headers: options }
    );
  }
}
