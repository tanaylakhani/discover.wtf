import {
  createErrorResponse,
  GetSuggestedPromptsOutputSchema,
  suggestedPromptsSchema,
  withApiSecurity,
} from "@/lib/api-validation";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return withApiSecurity(
    suggestedPromptsSchema,
    async (_, data) => {
      try {
        const result = await generateObject({
          model: openai("gpt-4o-mini"),
          schema: GetSuggestedPromptsOutputSchema,
          prompt: `
    You are an expert prompt engineer. Given the following markdown content, generate four creative and relevant prompts that a user might ask based on the content. Return the prompts as an array of four strings in JSON format under the key "prompts".

    Each prompt must be very short and clear and at most 10-12 words.

    Markdown content:
    ${data?.markdown}
    `,
        });

        console.log({ result: result?.object.prompts });

        return NextResponse.json(
          { success: true, prompts: result?.object.prompts },
          { status: 200 }
        );
      } catch (error) {
        console.error("Chat API error:", error);
        return createErrorResponse("Failed to process chat request", 500);
      }
    },
    { maxRequests: 20, windowMs: 60000 } // 20 requests per minute
  )(req);
}
