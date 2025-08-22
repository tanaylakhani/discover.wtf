"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="text-center max-w-md">
        {/* 404 Animation/Image */}
        <div className="text-8xl font-bold text-orange-500 mb-4">404</div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          Oops! The page you&apos;re looking for seems to have wandered off into the vast internet. 
          Don&apos;t worry, there&apos;s plenty more to discover!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/" className="inline-flex items-center">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.back();
              }
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>
            While you&apos;re here, why not{" "}
            <Link href="/" className="text-orange-500 hover:underline">
              discover something new
            </Link>
            ?
          </p>
        </div>
      </div>
    </div>
  );
}