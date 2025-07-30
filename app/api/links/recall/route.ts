import { createApolloClient } from "@/lib/apollo";
import { RECALL_LINKS_QUERY } from "@/lib/graphql/links";
import { options } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("Authorization");
    const token = auth?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: options }
      );
    }
    const currentPage =
      request?.nextUrl?.searchParams.get("currentPage") || "1";
    const perPage = request?.nextUrl?.searchParams.get("perPage") || "20";
    console.log({ currentPage, perPage });
    const client = createApolloClient(token);

    const data = await client.query({
      query: RECALL_LINKS_QUERY(2, parseInt(currentPage), parseInt(perPage)),
    });

    const links = data?.data?.recall_links;
    console.log({ links });
    if (links.length === 0) {
      return NextResponse.json(
        { error: "No links found" },
        { status: 404, headers: options }
      );
    }
    return NextResponse.json(
      {
        recall_links: links,
      },
      { status: 200, headers: options }
    );
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500, headers: options }
    );
  }
}
