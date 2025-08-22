"use client";

import type React from "react";
// No provider needed for Better Auth - it works with React Query under the hood

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
