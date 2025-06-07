import { GitHubUser } from "@repos-hub/shared-ui";
import { create } from "zustand";

interface GitHubStoreState {
  selectedUsers: GitHubUser[];
  suggestionsQuery: string;
}

interface GitHubStoreActions {
  setSelectedUsers: (users: GitHubUser[]) => void;
  addSelectedUser: (user: GitHubUser) => void;
  removeSelectedUser: (user: GitHubUser) => void;
  setSuggestionsQuery: (query: string) => void;
}

type GitHubStore = GitHubStoreState & GitHubStoreActions;

export const useGithubStore = create<GitHubStore>(set => ({
  selectedUsers: [],
  suggestionsQuery: "",

  setSelectedUsers: users => set({ selectedUsers: users }),
  addSelectedUser: user => set(state => ({
    selectedUsers: [...state.selectedUsers, user],
  })),
  removeSelectedUser: user => set(state => ({
    selectedUsers: state.selectedUsers.filter(u => u.id !== user.id),
  })),
  setSuggestionsQuery: query => set({ suggestionsQuery: query }),
}));
