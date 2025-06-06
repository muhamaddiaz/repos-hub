import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../lib/react-query";
import { githubApiService } from "../services/github-api.service";

export const useSearchUsers = (query: string, page = 1, perPage = 10) => {
  return useQuery({
    queryKey: queryKeys.github.userSearch(query, page, perPage),
    queryFn: () => githubApiService.searchUsers(query, page, perPage),
    enabled: query.trim().length >= 2,
  });
};

export const useUserSuggestions = (query: string, limit = 5) => {
  return useQuery({
    queryKey: queryKeys.github.userSuggestions(query, limit),
    queryFn: async () => {
      const response = await githubApiService.searchUsers(query, 1, limit);
      return response.items;
    },
    enabled: query.trim().length >= 2,
  });
};

export const useUserRepositories = (username: string) => {
  return useQuery({
    queryKey: queryKeys.github.userRepositories(username),
    queryFn: () => githubApiService.getUserRepositories(username),
    enabled: !!username.trim(),
  });
};

export const usePrefetchUserRepositories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.github.userRepositories(username),
        queryFn: () => githubApiService.getUserRepositories(username),
      });
    },
  });
};
