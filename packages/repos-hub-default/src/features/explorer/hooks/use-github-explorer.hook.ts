import { useCallback, useState } from "react";

import type { GitHubUser } from "../types/github.types";

import { usePrefetchUserRepositories } from "../queries/use-github-queries.query";

interface GitHubExplorerLocalState {
  selectedUsers: GitHubUser[];
  stagedUsers: GitHubUser[];
  searchQuery: string;
  suggestionsQuery: string;
}

export interface UseGitHubExplorerReturn {
  selectedUsers: GitHubUser[];
  suggestionsQuery: string;
  stagedUsers: GitHubUser[];

  addSelectedUser: (user: GitHubUser) => void;
  removeSelectedUser: (user: GitHubUser) => void;
  setSuggestionsQuery: (query: string) => void;
  submitStagedUsers: () => void;
}

const initialLocalState: GitHubExplorerLocalState = {
  selectedUsers: [],
  stagedUsers: [],
  searchQuery: "",
  suggestionsQuery: "",
};

export const useGitHubExplorer = (): UseGitHubExplorerReturn => {
  const [localState, setLocalState] = useState<GitHubExplorerLocalState>(initialLocalState);

  const prefetchRepositories = usePrefetchUserRepositories();

  const addSelectedUser = useCallback((user: GitHubUser): void => {
    setLocalState((prev) => {
      const isAlreadySelected = prev.stagedUsers.some(u => u.id === user.id);
      if (isAlreadySelected) {
        return prev;
      }

      prefetchRepositories.mutate(user.login);
      return {
        ...prev,
        stagedUsers: [...prev.stagedUsers, user],
      };
    });
  }, [prefetchRepositories]);

  const submitStagedUsers = useCallback((): void => {
    setLocalState(prev => ({
      ...prev,
      selectedUsers: [...prev.stagedUsers],
    }));
  }, []);

  const removeSelectedUser = useCallback((user: GitHubUser): void => {
    setLocalState(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.filter(u => u.id !== user.id),
      stagedUsers: prev.stagedUsers.filter(u => u.id !== user.id),
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
    stagedUsers: localState.stagedUsers,

    addSelectedUser,
    removeSelectedUser,
    setSuggestionsQuery,
    submitStagedUsers,
  };
};
