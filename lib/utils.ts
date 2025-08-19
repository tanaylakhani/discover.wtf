import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { QUERY_USER_BY_ID, User } from "./graphql/user";

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

export const getUserId = async (
  client: ApolloClient<NormalizedCacheObject>
): Promise<User> => {
  const { data, errors } = await client.query({
    query: QUERY_USER_BY_ID(),
  });

  if (errors && errors.length > 0) {
    // console.error("GraphQL Errors:", errors);
    throw new ErrorWithStatus("Error fetching user id", 500);
  }

  return data.user as User;
};

export const options = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // or set specific origin
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export class ErrorWithStatus extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type PublicRandomLink = {
  id: string;
  title: string;
  description: string;
  target_url: string;
  domain: string;
  favicon_url: string;
  screenshot_url: string;
  created_at: string; // ISO timestamp
  __typename: "PublicRandomLink";
};
