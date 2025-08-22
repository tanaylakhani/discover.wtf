import { createApolloClient, PublicRandomLink } from "@/lib/apollo";
import { PUBLIC_RANDOM_LINKS_QUERY } from "@/lib/graphql/links";
import { ApolloError } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";
import { withTokenValidation, createSuccessResponse, createErrorResponse, corsHeaders } from "@/lib/api-validation";
import { z } from "zod";

// Schema for query parameters
const querySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("100"),
});

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  return withTokenValidation(async (req, token) => {
    try {
      // Parse and validate query parameters
      const url = new URL(req.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());
      const { limit } = querySchema.parse(queryParams);

      const client = createApolloClient(token);
      
      const data = await client.query({
        query: PUBLIC_RANDOM_LINKS_QUERY,
        variables: { limit: Math.min(limit, 100) }, // Cap at 100 for performance
        errorPolicy: 'all', // Return partial data if available
      });

      const randomLinks = (data?.data?.public_random_links as PublicRandomLink[]) || [];

      if (randomLinks.length === 0) {
        return createErrorResponse("No random links found", 404, corsHeaders);
      }

      return createSuccessResponse(
        { random_links: randomLinks },
        `Found ${randomLinks.length} random links`,
        corsHeaders
      );
    } catch (error) {
      console.error("Error fetching random links:", error);
      
      if (error instanceof ApolloError) {
        return createErrorResponse(
          `GraphQL error: ${error.message}`,
          503,
          corsHeaders
        );
      }
      
      return createErrorResponse(
        "Failed to fetch random links",
        500,
        corsHeaders
      );
    }
  })(request);
}
