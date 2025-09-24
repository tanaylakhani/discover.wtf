import {
  chatRequestSchema,
  createErrorResponse,
  withApiSecurity,
} from "@/lib/api-validation";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, generateText, streamText } from "ai";
import { NextRequest } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const SYSTEM_PROMPT = `
You are a helpful, knowledgeable, and precise AI assistant. Your goal is to provide clear, structured, and actionable responses to the user's questions, always grounding your answers in the context provided as markdown in [Context] if available.

Instructions:
1. **Context Awareness**: If a [Context] section is provided, always base your answer primarily on the information in that context. If the context is missing or insufficient, politely mention this and answer as best as you can.
2. **Headings**: Use Markdown style headings (##, ###) to organize your response.
3. **Bold Text**: Emphasize important points, warnings, or key terms using bold.
4. **Lists**: Use numbered or bulleted lists for step-by-step instructions, examples, or multiple points.
5. **Clarity and Conciseness**: Write answers that are easy to read and understand. Use lists or tables where appropriate.
6. **Examples**: Provide examples to illustrate your explanation whenever possible.
7. **Code**: Use code blocks for code snippets and commands, with appropriate syntax highlighting.
8. **Actionable Steps**: Break instructions into step-by-step actions.
9. **Tone**: Be friendly, encouraging, and professional, but avoid unnecessary verbosity or filler.

Always respond following this format, ensuring your answer is based on the [Context] section if present.
`;

async function generateChatTitle(prompt: string) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system:
      "You are a title generator. Summarize the user’s query into a short, descriptive, 3–5 word chat title.",
    prompt,
  });

  return text?.trim() || "New Chat";
}

export async function POST(req: NextRequest) {
  return withApiSecurity(
    chatRequestSchema,
    async (request, data) => {
      if (!data) {
        return createErrorResponse("Invalid request data", 400);
      }

      const chatId = data.chatId;
      const userId = data.userId;
      const linkId = data.linkId;
      console.log({
        userId,
        chatId: data.chatId,
      });

      const lastUserMessage = [...(data.messages || [])]
        .reverse()
        .find((m) => m.role === "user");

      let rawQuery = "";
      if (lastUserMessage) {
        rawQuery = lastUserMessage.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(" ")
          .trim();
      }

      const title = rawQuery ? await generateChatTitle(rawQuery) : "New Chat";

      await db
        .insert(chats)
        .values({
          id: chatId as string,
          userId: userId as string,
          linkId: linkId as string,
          title,
        })
        .onConflictDoNothing();

      for (const m of data.messages || []) {
        if (m.role === "user") {
          await db.insert(messages).values({
            chatId: chatId as string,
            role: m.role,
            content: m.parts, // UIMessage.parts goes here
          });
        }
      }
      try {
        const result = streamText({
          system: `${SYSTEM_PROMPT}
          
          [Context]:

          ${data.ctx || "No context provided"}

          `,
          model: openai("gpt-4o-mini"),
          messages: convertToModelMessages(data.messages || []),
        });

        return result.toUIMessageStreamResponse({
          onFinish: async (message) => {
            await db.insert(messages).values({
              chatId: chatId as string,
              role: message?.responseMessage?.role,
              content: message.responseMessage?.parts,
            });
          },
        });
      } catch (error) {
        console.error("Chat API error:", error);
        return createErrorResponse("Failed to process chat request", 500);
      }
    },
    { maxRequests: 20, windowMs: 60000 } // 20 requests per minute
  )(req);
}
