"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We&apos;re sorry, but something unexpected happened on this page. Please try again.
        </p>
        
        {process.env.NODE_ENV === "development" && (
          <details className="text-left bg-red-50 p-4 rounded-lg mb-4">
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
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/";
              }
            }}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}