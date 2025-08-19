import { createApolloClient } from "@/lib/apollo";
import { QUERY_USER } from "@/lib/graphql/user";
import { ErrorWithStatus } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const token = req.headers.get("token") as string;
  try {
    const client = createApolloClient(token);
    const response = await client.query({
      query: QUERY_USER(),
      variables: { id: userId },
    });
    return NextResponse.json(
      { success: true, data: response.data?.user, error: null },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ErrorWithStatus) {
      return NextResponse.json(
        { success: false, data: null, error: error?.message },
        { status: error?.status }
      );
    }
  }
}
