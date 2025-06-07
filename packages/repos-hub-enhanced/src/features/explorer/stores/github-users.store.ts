import { GitHubUser } from "@repos-hub/shared-ui";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GitHubStoreState {
  selectedUsers: GitHubUser[];
}

interface GitHubStoreActions {
  addSelectedUser: (user: GitHubUser) => void;
  removeSelectedUser: (user: GitHubUser) => void;
}

type GitHubStore = GitHubStoreState & GitHubStoreActions;

export const useGithubStore = create<GitHubStore>()(
  persist(
    set => ({
      selectedUsers: [],

      addSelectedUser: user => set(state => ({
        selectedUsers: [...state.selectedUsers, user],
      })),
      removeSelectedUser: user => set(state => ({
        selectedUsers: state.selectedUsers.filter(u => u.id !== user.id),
      })),
    }),
    {
      name: "github-users-storage",
    },
  ),
);
