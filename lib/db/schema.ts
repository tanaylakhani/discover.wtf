import {
  boolean,
  index,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const likes = pgTable(
  "likes",
  {
    userId: text("user_id").notNull(), // from gqlToken
    linkId: text("link_id").notNull(), // passed from extension
    likedAt: timestamp("liked_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.linkId] }), // one like per user per link
  })
);

export type TCommentAuthor = {
  id: string;
  name: string | null | undefined;
  username: string | null | undefined;
  email: string;
  avatar: string | null | undefined;
};

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  linkId: text("link_id").notNull(),
  content: text("content").notNull(),
  user: jsonb("user").$type<TCommentAuthor>().notNull(),
  isPrivate: boolean("is_private").default(false).notNull(),
  commentedAt: timestamp("commented_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const commentMedia = pgTable("comment_media", {
  id: uuid("id").defaultRandom().primaryKey(),
  commentId: uuid("comment_id")
    .references(() => comments.id)
    .notNull(),
  type: varchar("type", { length: 16 }).notNull(), // image | video | file
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookmarks table
export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text("user_id").notNull(),
    linkId: text("link_id").notNull(),
    bookmarkedAt: timestamp("bookmarked_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.linkId] }), // avoid duplicate bookmarks
  })
);

export const userLinkVisits = pgTable(
  "user_link_visits",
  {
    userId: text("user_id").notNull(), // from gqlToken → Betterstacks
    linkId: text("link_id").notNull(), // passed from extension
    visitedAt: timestamp("visited_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.linkId] }), // avoid duplicates
    userIdx: index("idx_user").on(table.userId),
    linkIdx: index("idx_link").on(table.linkId),
  })
);

// TypeScript types for the schema
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
