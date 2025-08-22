// Simple in-memory rate limiting for API routes
// In production, consider using Redis or a proper rate limiting service

type RateLimitInfo = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitInfo>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, info] of rateLimitMap.entries()) {
    if (now > info.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 } // 10 requests per minute by default
): RateLimitResult {
  const now = Date.now();
  const windowStart = now;
  const resetTime = windowStart + config.windowMs;
  
  const existing = rateLimitMap.get(identifier);
  
  if (!existing || now > existing.resetTime) {
    // First request or window expired
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime,
    });
    
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }
  
  if (existing.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: existing.resetTime,
    };
  }
  
  // Increment count
  existing.count++;
  
  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - existing.count,
    resetTime: existing.resetTime,
  };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };
}

// Helper to get client IP from request
export function getClientIP(request: Request): string {
  // Check various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-remote-addr');
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (remoteAddr) {
    return remoteAddr;
  }
  
  // Fallback - in development this might be undefined
  return 'unknown';
}