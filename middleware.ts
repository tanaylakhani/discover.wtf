import { createApolloClient } from "@/lib/apollo";
import { ErrorWithStatus, getUserId } from "@/lib/utils";
import { corsHeaders } from "@/lib/api-validation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Add security headers for all requests
  const response = NextResponse.next();
  
  // Security headers for production
  if (process.env.NODE_ENV === "production") {
    // Prevent clickjacking
    response.headers.set("X-Frame-Options", "DENY");
    
    // Prevent XSS attacks
    response.headers.set("X-XSS-Protection", "1; mode=block");
    
    // Prevent MIME sniffing
    response.headers.set("X-Content-Type-Options", "nosniff");
    
    // Referrer policy
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    
    // HSTS (HTTP Strict Transport Security) - only for HTTPS
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }
  
  // Handle API authentication for specific routes
  if (req.nextUrl.pathname.startsWith("/api/links/")) {
    const auth = req.headers.get("Authorization");
    const token = auth?.replace("Bearer ", "") || req.headers.get("token");

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    try {
      const client = createApolloClient(token);
      const user = await getUserId(client);
      
      if (!user?.id) {
        return new NextResponse(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: corsHeaders,
        });
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("token", token);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("Auth middleware error:", error);
      
      if (error instanceof ErrorWithStatus) {
        return NextResponse.json(
          { error: error.message },
          {
            status: error.status,
            headers: corsHeaders,
          }
        );
      }
      
      return NextResponse.json(
        { error: "Internal Server Error" },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
