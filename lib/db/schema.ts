import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Better Auth Tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Application Tables
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

// Auth types
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

// Application types
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
