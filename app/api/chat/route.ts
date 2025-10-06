import {
  chatRequestSchema,
  createErrorResponse,
  GetRelatedQuestionOutputSchema,
  withApiSecurity,
  withTokenValidation,
} from "@/lib/api-validation";
import { createApolloClient } from "@/lib/apollo";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
  generateText,
  streamText,
} from "ai";
import { NextRequest } from "next/server";
import { bookmarkLink, ChatMessage, getSimilarLinks } from "./tools";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const SYSTEM_PROMPT = `
You are a helpful, knowledgeable, and precise AI assistant. Your goal is to provide clear, structured, and actionable responses to the user's questions, always grounding your answers in the context provided as markdown in [Context] if available.

IMPORTANT: You have access to powerful tools that can help users. Always prioritize using these tools when appropriate:

1. **getSimilarLinks**: Use this tool whenever users ask about finding, discovering, or exploring similar/related content, links, or articles. This includes queries like:
   - "find similar links"
   - "show me related content" 
   - "what else is like this"
   - "get more links like this"
   - "search for similar pages"
   - "find related articles"


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

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateChatTitle(prompt: string) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system:
      "You are a title generator. Summarize the user’s query into a short, descriptive, 3–5 word chat title.",
    prompt,
  });

  return text?.trim() || "New Chat";
}

export async function POST(req: NextRequest) {
  return withTokenValidation(async (req, token) => {
    return withApiSecurity(
      chatRequestSchema,
      async (request, data) => {
        if (!data) {
          return createErrorResponse("Invalid request data", 400);
        }
        const client = createApolloClient(token);

        const chatId = data.chatId;
        const userId = data.userId;
        const linkId = data.linkId;

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

        await db
          .insert(chats)
          .values({
            id: chatId as string,
            userId: userId as string,
            linkId: linkId as string,
            title: rawQuery || "New Chat",
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
          const stream = createUIMessageStream<ChatMessage>({
            execute: ({ writer }) => {
              const result = streamText({
                system: `${SYSTEM_PROMPT}
              [Context]:
              ${data.ctx || "No context provided"}
              `,
                model: google("gemini-2.5-flash"),
                messages: convertToModelMessages(data.messages || []),
                tools: {
                  getSimilarLinks: getSimilarLinks(client, writer),
                  bookmarkLink: bookmarkLink(linkId, userId, writer),
                },
              });

              writer.merge(
                result.toUIMessageStream({
                  onFinish: async (message) => {
                    // Save the assistant's message to database
                    await db.insert(messages).values({
                      chatId: chatId as string,
                      role: message?.responseMessage?.role,
                      content: message.responseMessage?.parts,
                    });

                    // Generate related questions after the main response is complete
                    try {
                      writer.write({
                        type: "data-getRelatedQuestions",
                        data: {
                          status: "generating",
                        },
                      });

                      const { object } = await generateObject({
                        model: google("gemini-2.5-flash"),
                        messages: convertToModelMessages(data.messages || []),
                        schema: GetRelatedQuestionOutputSchema,
                        system: `
                       Based on the current conversation about "${rawQuery}",
                       Suggest 5 natural follow-up questions the user might ask next.
                         Each prompt must be very short and clear and at most 10-12 words.
                      `,
                      });

                      console.log({ object: object?.prompts });
                      writer.write({
                        type: "data-getRelatedQuestions",
                        data: {
                          status: "complete",
                          prompts: object.prompts,
                        },
                      });
                    } catch (e) {
                      writer.write({
                        type: "data-getRelatedQuestions",
                        data: {
                          status: "error",
                          error:
                            e instanceof Error ? e.message : "Unknown error",
                        },
                      });
                    }
                  },
                })
              );
            },
          });

          return createUIMessageStreamResponse({ stream });
        } catch (error) {
          return createErrorResponse("Failed to process chat request", 500);
        }
      },
      { maxRequests: 20, windowMs: 60000 } // 20 requests per minute
    )(req);
  })(req);
}
