"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Our team has been notified and is working on fixing it.
            </p>
            
            {process.env.NODE_ENV === "development" && (
              <details className="text-left bg-red-50 p-4 rounded-lg mb-6">
                <summary className="cursor-pointer font-medium text-red-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                  {"\n\n"}
                  {error.stack}
                </pre>
              </details>
            )}
            
            <div className="space-x-4">
              <Button onClick={reset}>
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/"}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}