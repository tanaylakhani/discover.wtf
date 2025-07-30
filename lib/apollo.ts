import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

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
