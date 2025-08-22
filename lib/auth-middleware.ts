import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Better Auth middleware helper for protected routes
 */
export async function authMiddleware(request: NextRequest) {
  try {
    // Check if the user has a valid session
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    if (!session?.user) {
      return null; // No session
    }
    
    return session;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return null;
  }
}

/**
 * Get user from Better Auth session in middleware
 */
export async function getMiddlewareUser(request: NextRequest) {
  const session = await authMiddleware(request);
  return session?.user || null;
}

/**
 * Check if request is authenticated in middleware
 */
export async function isMiddlewareAuthenticated(request: NextRequest) {
  const session = await authMiddleware(request);
  return !!session?.user;
}