import { createErrorResponse, withApiSecurity } from "@/lib/api-validation";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return withApiSecurity(
    undefined,
    async () => {
      const chatId = req.nextUrl.searchParams.get("chatId");
      const linkId = req.nextUrl.searchParams.get("linkId");
      try {
        if (!chatId) {
          // Return raw join result for history
          const chatMessages = await db
            .select()
            .from(chats)
            .where(and(eq(chats.linkId, linkId as string)))
            .orderBy(desc(chats.createdAt));

          return NextResponse.json(
            { success: true, chats: chatMessages },
            { status: 200 }
          );
        } else {
          // Aggregate messages into an array
          const chat = await db
            .select()
            .from(chats)
            .where(and(eq(chats.linkId, linkId as string)))
            .limit(1);

          if (chat.length === 0) {
            return createErrorResponse("Chat not found", 404);
          }

          const chatMessages = await db
            .select()
            .from(messages)
            .where(eq(messages.chatId, chatId as string))
            .orderBy(asc(messages.createdAt));

          return NextResponse.json(
            {
              success: true,
              chat: chat[0],
              messages: chatMessages,
            },
            { status: 200 }
          );
        }
      } catch (error) {
        return createErrorResponse("Failed to get chat messages", 500);
      }
    },
    { maxRequests: 20, windowMs: 60000 } // 20 requests per minute
  )(req);
}
