import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process?.env.GOOGLE_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, ctx }: { messages: UIMessage[]; ctx: string } =
    await req.json();

  const result = streamText({
    system: `
    You are a helpful, knowledgeable, and precise AI assistant. Your goal is to provide clear, structured, and actionable responses to the user’s questions. Always organize your answers using the following format:

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
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
// import google, { systemPrompt } from "@/lib/ai";
// import redis from "@/lib/redis";
// import { Ratelimit } from "@upstash/ratelimit";
// import { streamText } from "ai";
// import { NextRequest } from "next/server";

// const ratelimit = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.fixedWindow(5, "30s"),
// });

// export const maxDuration = 30;

// export async function POST(req: NextRequest) {
//   const ip = req.ip ?? "ip";
//   const { success, remaining } = await ratelimit.limit(ip);
//   if (!success) {
//     return Response.json({ remaining }, { status: 429 });
//   }
//   const { ctx, messages } = await req.json();

//   const result = await streamText({
//     model: google("gemini-1.5-flash"),
//     system: `
//         ${systemPrompt}

//         <context>
//         ${ctx}
//         </context>
//         `,
//     temperature: 0.5,
//     messages,
//   });
//   return result.toAIStreamResponse();
// }
