import {
  createErrorResponse,
  suggestedPromptsSchema,
  withApiSecurity,
} from "@/lib/api-validation";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  return withApiSecurity(
    undefined,
    async () => {
      const chatId = params.chatId;
      try {
        const chatMessages = await db
          .select()
          .from(messages)
          .where(eq(messages.chatId, chatId))
          .orderBy(asc(messages.createdAt));

        return NextResponse.json(
          { success: true, messages: chatMessages },
          { status: 200 }
        );
      } catch (error) {
        console.error("API error:", error);
        return createErrorResponse("Failed to get chat messages", 500);
      }
    },
    { maxRequests: 20, windowMs: 60000 } // 20 requests per minute
  )(req);
}
