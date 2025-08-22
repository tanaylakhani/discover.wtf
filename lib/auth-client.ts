import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === "production" 
    ? process.env.BETTER_AUTH_URL 
    : "http://localhost:3001", // Match your dev server port
});

// Export commonly used methods
export const { 
  signIn, 
  signOut, 
  signUp, 
  useSession, 
  getSession,
  updateUser,
} = authClient;

// Social login functions
export const signInWithGoogle = async () => {
  return await signIn.social({
    provider: "google",
  });
};

// Helper function to check if user is authenticated
export const useAuth = () => {
  const session = useSession();
  return {
    user: session.data?.user || null,
    isLoading: session.isPending,
    isAuthenticated: !!session.data?.user,
    session: session.data,
  };
};