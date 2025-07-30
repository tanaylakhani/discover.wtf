import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { QUERY_USER, User } from "./graphql/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirst(word: string): string {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export const withCORS = (handler: () => Promise<Response>) => {
  return async () => {
    const res = await handler();
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res;
  };
};

export const getUserByToken = async (
  client: ApolloClient<NormalizedCacheObject>
): Promise<User> => {
  try {
    const { data, errors } = await client.query({
      query: QUERY_USER(),
    });

    if (errors && errors.length > 0) {
      console.error("GraphQL Errors:", errors);
      throw new Error("Failed to fetch user due to GraphQL errors.");
    }

    if (!data?.user) {
      throw new Error("User not found in response.");
    }

    return data.user as User;
  } catch (err: any) {
    console.error("getUserByToken error:", err);
    throw new Error(`Could not fetch user: ${err.message || "Unknown error"}`);
  }
};

export const options = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // or set specific origin
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
