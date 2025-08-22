import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Get the current session on the server side
 */
export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return session;
}

/**
 * Get the current user on the server side
 */
export async function getServerUser() {
  const session = await getServerSession();
  return session?.user || null;
}

/**
 * Require authentication on the server side
 * Throws an error if the user is not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession();
  
  if (!session?.user) {
    throw new Error("Unauthorized - Authentication required");
  }
  
  return session;
}

/**
 * Check if the current user is authenticated on the server side
 */
export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session?.user;
}