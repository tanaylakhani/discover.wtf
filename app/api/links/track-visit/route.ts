import { createApolloClient } from "@/lib/apollo";
import { db } from "@/lib/db";
import { userLinkVisits } from "@/lib/db/schema";
import { getUserByToken, options } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extracting Token from Header
    const auth = request.headers.get("Authorization");
    const token = auth?.replace("Bearer ", "");
    if (!token) throw new ErrorWithStatus("Unauthorized", 401);

    // Getting LinkId from Query Parameters
    const linkId = request?.nextUrl?.searchParams.get("linkId") as string;
    if (!linkId) throw new ErrorWithStatus("LinkId was not provided", 404);

    const client = createApolloClient(token);

    // Getting UserId from Token
    const { id } = await getUserByToken(client);
    if (!id) throw new ErrorWithStatus("User not found", 404);

    await db.insert(userLinkVisits).values({
      linkId: linkId,
      userId: id,
    });

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

class ErrorWithStatus extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
