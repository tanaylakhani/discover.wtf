import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  
  // Environment variables
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL || "http://localhost:3001",
  
  // Session configuration (mapping from NextAuth schema)
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
    },
  },
  
  // Account and session field mappings for NextAuth compatibility
  // These will be added when we update the database schema
  
  // Social providers - update these based on your NextAuth providers
  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    }),
    // Add other providers as needed
    // github: {
    //   clientId: env.GITHUB_CLIENT_ID || "",
    //   clientSecret: env.GITHUB_CLIENT_SECRET || "",
    // },
  },
  
  // Plugins
  plugins: [
    nextCookies(),
  ],
  
  // Trusted origins
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001", 
    env.NEXTAUTH_URL || "",
  ].filter(Boolean),
});