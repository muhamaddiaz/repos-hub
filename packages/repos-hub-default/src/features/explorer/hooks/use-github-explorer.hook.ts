import { useCallback, useState } from "react";

import type { GitHubUser } from "../types/github.types";

import { usePrefetchUserRepositories } from "../queries/use-github-queries.query";

interface GitHubExplorerLocalState {
  selectedUsers: GitHubUser[];
  searchQuery: string;
  suggestionsQuery: string;
}

export interface UseGitHubExplorerReturn {
  selectedUsers: GitHubUser[];
  suggestionsQuery: string;

  addSelectedUser: (user: GitHubUser) => void;
  removeSelectedUser: (user: GitHubUser) => void;
  setSuggestionsQuery: (query: string) => void;
}

const initialLocalState: GitHubExplorerLocalState = {
  selectedUsers: [],
  searchQuery: "",
  suggestionsQuery: "",
};

export const useGitHubExplorer = (): UseGitHubExplorerReturn => {
  const [localState, setLocalState] = useState<GitHubExplorerLocalState>(initialLocalState);

  const prefetchRepositories = usePrefetchUserRepositories();

  const addSelectedUser = useCallback((user: GitHubUser): void => {
    setLocalState((prev) => {
      const isAlreadySelected = prev.selectedUsers.some(u => u.id === user.id);
      if (isAlreadySelected) {
        return prev;
      }

      prefetchRepositories.mutate(user.login);
      return {
        ...prev,
        selectedUsers: [...prev.selectedUsers, user],
      };
    });
  }, [prefetchRepositories]);

  const removeSelectedUser = useCallback((user: GitHubUser): void => {
    setLocalState(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.filter(u => u.id !== user.id),
    }));
  }, []);

  const setSuggestionsQuery = useCallback((query: string): void => {
    setLocalState(prev => ({
      ...prev,
      suggestionsQuery: query,
    }));
  }, []);

  return {
    selectedUsers: localState.selectedUsers,
    suggestionsQuery: localState.suggestionsQuery,

    addSelectedUser,
    removeSelectedUser,
    setSuggestionsQuery,
  };
};
