import {
  createErrorResponse,
  GetSuggestedPromptsOutputSchema,
  suggestedPromptsSchema,
  withApiSecurity,
} from "@/lib/api-validation";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { google } from "../route";

export async function POST(req: NextRequest) {
  return withApiSecurity(
    suggestedPromptsSchema,
    async (_, data) => {
      try {
        const result = await generateObject({
          model: google("gemini-2.5-flash"),
          schema: GetSuggestedPromptsOutputSchema,
          prompt: `
    You are an expert prompt engineer. Given the following markdown content, generate four creative and relevant prompts that a user might ask based on the content. Return the prompts as an array of four strings in JSON format under the key "prompts".

    Each prompt must be very subtle,short and clear and at most 4-6 words.

    Markdown content:
    ${data?.markdown}
    `,
        });

        return NextResponse.json(
          { success: true, prompts: result?.object.prompts },
          { status: 200 }
        );
      } catch (error) {
        return createErrorResponse(
          "Failed to process chat request: " + (error as Error)?.message,
          500
        );
      }
    },
    { maxRequests: 20, windowMs: 60000 } // 20 requests per minute
  )(req);
}
