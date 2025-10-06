import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import {
  rateLimit,
  getClientIP,
  getRateLimitHeaders,
  RateLimitConfig,
} from "./rate-limit";
import { UIMessage } from "ai";

// Common validation schemas
export const tokenSchema = z.string().min(1, "Token is required");
export const linkIdSchema = z.string().min(1, "Link ID is required");
export const userIdSchema = z.string().min(1, "User ID is required");

// Chat request validation
// Infer the type of UIMessage from the ai package
export type ChatMessage = UIMessage;

export const chatRequestSchema = z.object({
  messages: z.array(z.custom<UIMessage>()),
  ctx: z.string().optional(),
  chatId: z.string(),
  userId: z.string(),
  linkId: z.string(),
});
export const suggestedPromptsSchema = z.object({
  markdown: z.string(),
});
export const GetSuggestedPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).length(4),
});
export const GetRelatedQuestionOutputSchema = z.object({
  prompts: z.array(z.string()).length(5),
});

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Create standardized error responses
export function createErrorResponse(
  message: string,
  status: number = 400,
  headers?: Record<string, string>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status, headers }
  );
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  headers?: Record<string, string>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: 200, headers }
  );
}

// Rate limiting middleware
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const clientIP = getClientIP(req);
    const rateLimitResult = rateLimit(clientIP, config);
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.success) {
      return createErrorResponse(
        "Too many requests. Please try again later.",
        429,
        rateLimitHeaders
      );
    }

    const response = await handler(req);

    // Add rate limit headers to the response
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

// Validation middleware
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      let data: any;

      if (req.method === "GET") {
        // For GET requests, parse URL params
        const url = new URL(req.url);
        data = Object.fromEntries(url.searchParams.entries());
      } else {
        // For POST/PUT/PATCH requests, parse JSON body
        data = await req.json();
      }

      const validatedData = schema.parse(data);
      return await handler(req, validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return createErrorResponse(`Validation error: ${errorMessage}`, 400);
      }

      if (error instanceof SyntaxError) {
        return createErrorResponse("Invalid JSON in request body", 400);
      }

      console.error("Validation middleware error:", error);
      return createErrorResponse("Internal server error", 500);
    }
  };
}

// Combined middleware
export function withApiSecurity<T>(
  schema: z.ZodSchema<T> | undefined,
  handler: (req: NextRequest, data?: T) => Promise<any>,
  rateLimitConfig?: RateLimitConfig
) {
  if (schema) {
    return withRateLimit(withValidation(schema, handler), rateLimitConfig);
  } else {
    // If no schema, just run handler with rate limiting, no validation
    return withRateLimit((req) => handler(req, undefined), rateLimitConfig);
  }
}

// Token validation middleware
export function withTokenValidation(
  handler: (req: NextRequest, token: string) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const token =
      req.headers.get("token") ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return createErrorResponse("Authentication token is required", 401);
    }

    try {
      const validatedToken = tokenSchema.parse(token);
      return await handler(req, validatedToken);
    } catch (error) {
      return createErrorResponse("Invalid authentication token", 401);
    }
  };
}

// CORS headers for API routes
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, token",
  "Access-Control-Max-Age": "86400",
};
