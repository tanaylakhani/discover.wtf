import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Loading amazing discoveries...
        </h2>
        <p className="text-gray-600">
          Finding the best of the internet just for you
        </p>
      </div>
    </div>
  );
}