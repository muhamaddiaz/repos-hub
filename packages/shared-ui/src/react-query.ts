import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  github: {
    all: ["github"] as const,
    users: () => [...queryKeys.github.all, "users"] as const,
    userSearch: (query: string, page?: number, perPage?: number) =>
      [...queryKeys.github.users(), "search", { query, page, perPage }] as const,
    userSuggestions: (query: string, limit?: number) =>
      [...queryKeys.github.users(), "suggestions", { query, limit }] as const,
    repositories: () => [...queryKeys.github.all, "repositories"] as const,
    userRepositories: (username: string) =>
      [...queryKeys.github.repositories(), "user", username] as const,
  },
} as const;
