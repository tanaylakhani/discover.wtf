import { createApolloClient } from "@/lib/apollo";
import { ErrorWithStatus, getUserId, options } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: options,
    });
  }

  try {
    const client = createApolloClient(token);
    const user = await getUserId(client);
    console.log({ user });
    if (!user?.id) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: options,
      });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", user?.id);
    requestHeaders.set("token", token);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Middleware error:", error);
    if (error instanceof ErrorWithStatus) {
      return NextResponse.json(
        { error: error.message },
        {
          status: error.status,
          headers: options,
        }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: options,
      }
    );
  }
}
export const config = {
  matcher: "/api/links/:path*",
};
