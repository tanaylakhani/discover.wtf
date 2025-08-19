import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  DocumentNode,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import {
  PUBLIC_RANDOM_LINKS_QUERY,
  PUBLIC_RANDOM_LINKS_QUERY_STRING,
} from "./graphql/links";

// Types for BetterStacks API responses
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

interface GraphQLRequestPayload<V = Record<string, unknown>> {
  query: string | DocumentNode;
  variables?: V;
}

// Generic interface for GraphQL response
interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

// Fetch-based API client for BetterStacks
export const fetchBetterStacksAPI = async <T>(
  payload: GraphQLRequestPayload,
  token: string
): Promise<T> => {
  const baseUrl = "https://api.betterstacks.com/graphql";
  // Convert DocumentNode to string if needed
  const query =
    typeof payload.query === "string"
      ? payload.query
      : (payload.query as any)?.source?.body || "";
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Authorization": token,
    },
    body: JSON.stringify({
      query,
      variables: payload.variables || {},
    }),
  });

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }

  const result = (await response.json()) as GraphQLResponse<T>;

  if (result.errors?.length) {
    // Handle authentication errors
    if (result.errors.some((err) => err.message === "Sign In again")) {
      // Redirect to login will be handled by the component
      throw new Error("Sign In again");
    }
    throw new Error(result.errors.map((e) => e.message).join(", "));
  }

  return result.data;
};

// Specific function to get random public links
export const getPublicRandomLinks = async (
  token: string
): Promise<PublicRandomLink[]> => {
  try {
    let lastError: Error | null = null;

    try {
      const response = await fetchBetterStacksAPI<
        GraphQLResponse<PublicRandomLink[]>
      >({ query: PUBLIC_RANDOM_LINKS_QUERY_STRING }, token);

      console.log(`Success: ${response}`);

      return response.data || [];
    } catch (error) {
      console.log(`Failed with endpoint: `, error);
      lastError = error as Error;
    }

    // If all endpoints failed, throw the last error
    throw lastError || new Error("All REST endpoints failed");
  } catch (error) {
    console.error("Error fetching random links via REST API:", error);
    throw error;
  }
};

// Factory to create Apollo Client in API route context
export const createApolloClient = (token?: string) => {
  try {
    const httpLink = new HttpLink({
      uri: "https://api.betterstacks.com/graphql",
      fetch,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}`, "X-Authorization": token }
          : {}),
      },
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.error(
            `[GraphQL error]: Message: ${message}, Path: ${path}`,
            locations
          );
        });
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    });

    const retryLink = new RetryLink({
      delay: {
        initial: 300,
        max: 5000,
        jitter: true,
      },
      attempts: {
        max: 2,
        retryIf: (error) => {
          if (!error) return false;
          return (
            !error.statusCode ||
            error.statusCode >= 500 ||
            error.name === "NetworkError"
          );
        },
      },
    });

    const client = new ApolloClient({
      ssrMode: true,
      link: from([retryLink, errorLink, httpLink]),
      cache: new InMemoryCache({ resultCaching: false }),
      defaultOptions: {
        query: { fetchPolicy: "no-cache", errorPolicy: "all" },
        mutate: { errorPolicy: "all" },
      },
    });

    return client;
  } catch (error) {
    console.error("Error creating Apollo Client:", error);
    throw new Error("Failed to create Apollo Client");
  }
};
