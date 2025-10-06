import { db } from "@/lib/db";
import { bookmarks } from "@/lib/db/schema";
import { PUBLIC_RANDOM_LINKS_QUERY } from "@/lib/graphql/links";
import { PublicRandomLink } from "@/lib/utils";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { InferUITool, tool, UIMessage, UIMessageStreamWriter } from "ai";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
export type ChatTools = {
  getSimilarLinks: InferUITool<ReturnType<typeof getSimilarLinks>>;
};

export type CustomUIDataTypes = {
  getSimilarLinks: {
    text?: string;
    links?: PublicRandomLink[];
    status: "fetching" | "found-n-items" | "links-loading" | "complete";
  };
  bookmarkLink: {
    text?: string;
    bookmarked?: boolean;
    status: "fetching" | "complete";
  };
  getRelatedQuestions: {
    status: "generating" | "complete" | "error";
    prompts?: string[];
    error?: string;
  };
};

export type ChatMessage = UIMessage<never, CustomUIDataTypes, ChatTools>;
export const getSimilarLinks = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  writer: UIMessageStreamWriter<ChatMessage>
) =>
  tool({
    description: `Find and retrieve related or similar links from the database based on user queries. 
    
    This tool should be called when the user asks for:
    - "find similar links" or "find related links"
    - "show me similar content" or "get related articles"
    - "what else is similar to this" or "find more like this"
    - "search for related links" or "get similar pages"
    - Any request to discover or explore similar content
    
    The tool will search through the database of public links and return relevant matches.
    You do NOT need a specific link from the user - this tool can find similar content based on the current context or page being viewed.`,

    inputSchema: z.object({ link: z.custom<PublicRandomLink>() }),
    execute: async ({ link }) => {
      writer.write({
        type: "data-getSimilarLinks",
        data: {
          status: "fetching",
          text: "🔍 Searching for similar links in DB",
        },
      });

      const data = await apolloClient.query({
        query: PUBLIC_RANDOM_LINKS_QUERY(),
        variables: { limit: 4 }, // Cap at 100 for performance
        errorPolicy: "all", // Return partial data if available
      });

      const randomLinks =
        (data?.data?.public_random_links as PublicRandomLink[]) || [];

      writer.write({
        type: "data-getSimilarLinks",
        data: {
          status: "found-n-items",
          text: `🌱 Found ${randomLinks.length} links`,
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate delay
      writer.write({
        type: "data-getSimilarLinks",
        data: {
          status: "links-loading",
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate delay
      writer.write({
        type: "data-getSimilarLinks",
        data: { status: "complete", links: randomLinks },
      });
      return randomLinks;
    },
  });
export const bookmarkLink = (
  linkId: string,
  userId: string,
  writer: UIMessageStreamWriter<ChatMessage>
) =>
  tool({
    description: "Bookmark a link in the database",
    inputSchema: z.object({
      bookmark: z.boolean()
        .describe(`Specifies whether the user wants to bookmark or unbookmark the link
    true: bookmark the link
    false: unbookmark the link
      
      `),
    }),
    execute: async ({ bookmark }) => {
      console.log({ bookmark });

      writer.write({
        type: "data-bookmarkLink",
        data: {
          status: "fetching",
          text: bookmark
            ? "🔍 Checking bookmark status..."
            : "🔍 Checking bookmark status...",
        },
      });

      const existingBookmark = await db
        .select()
        .from(bookmarks)
        .where(and(eq(bookmarks.linkId, linkId), eq(bookmarks.userId, userId)))
        .limit(1);

      const isCurrentlyBookmarked = existingBookmark.length > 0;

      if (bookmark && isCurrentlyBookmarked) {
        writer.write({
          type: "data-bookmarkLink",
          data: {
            status: "complete",
            bookmarked: true,
            text: "ℹ️ This link is already bookmarked!",
          },
        });
        return;
      }

      if (!bookmark && !isCurrentlyBookmarked) {
        writer.write({
          type: "data-bookmarkLink",
          data: {
            status: "complete",
            bookmarked: false,
            text: "ℹ️ This link is not in your bookmarks!",
          },
        });
        return;
      }

      // Proceed with the operation
      writer.write({
        type: "data-bookmarkLink",
        data: {
          status: "fetching",
          text: bookmark ? "🌱 Bookmarking link..." : "🚨 Removing bookmark...",
        },
      });

      if (bookmark) {
        await db
          .insert(bookmarks)
          .values({
            linkId: linkId,
            userId: userId,
          })
          .onConflictDoUpdate({
            target: [bookmarks.linkId, bookmarks.userId],
            set: {
              bookmarkedAt: new Date(),
            },
          });
      } else {
        await db
          .delete(bookmarks)
          .where(
            and(eq(bookmarks.linkId, linkId), eq(bookmarks.userId, userId))
          );
      }

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay

      writer.write({
        type: "data-bookmarkLink",
        data: {
          status: "complete",
          bookmarked: bookmark,
          text: bookmark
            ? "✅ Link bookmarked successfully!"
            : "❌ Link removed from bookmarks successfully!",
        },
      });
    },
  });
