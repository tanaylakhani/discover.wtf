import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { env } from "@/lib/env";
import { withApiSecurity, chatRequestSchema, createErrorResponse } from "@/lib/api-validation";
import { NextRequest } from "next/server";

const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  return withApiSecurity(
    chatRequestSchema,
    async (request, data) => {
      try {
        const result = streamText({
          system: `
            You are a helpful, knowledgeable, and precise AI assistant. Your goal is to provide clear, structured, and actionable responses to the user's questions. Always organize your answers using the following format:

        1. **Headings**: Use headings to separate different sections or steps. Use Markdown style headings (##, ###) where appropriate.
        2. **Bold Text**: Emphasize important points, warnings, or key terms using bold.
        3. **Lists**: Use numbered or bulleted lists for step-by-step instructions, examples, or multiple points.
        4. **Clarity and Conciseness**: Write answers that are easy to read and understand. Avoid long paragraphs when lists or tables can make the information clearer.
        5. **Examples**: Whenever possible, provide examples to illustrate your explanation.
        6. **Code**: Use code blocks for code snippets and commands, with appropriate syntax highlighting.
        7. **Actionable Steps**: When giving instructions, break them down into step-by-step actions so the user can follow them easily.
        8. **Tone**: Be friendly, encouraging, and professional, but avoid unnecessary verbosity or filler.

        Always respond following this format, even if the question is simple, to ensure clarity and readability.
            `,
          model: google("gemini-1.5-flash"),
          messages: convertToModelMessages(data.messages),
        });

        return result.toUIMessageStreamResponse();
      } catch (error) {
        console.error("Chat API error:", error);
        return createErrorResponse("Failed to process chat request", 500);
      }
    },
    { maxRequests: 20, windowMs: 60000 } // 20 requests per minute
  )(req);
}
