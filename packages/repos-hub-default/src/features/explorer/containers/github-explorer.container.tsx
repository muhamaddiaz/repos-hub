import { SearchBar, type SearchSuggestion } from "@repos-hub/shared-ui";
import { useCallback, useRef, useMemo } from "react";

import { SelectedUserRepositories } from "../components/selected-user-repositories.component";
import { useGitHubExplorer } from "../hooks/use-github-explorer.hook";
import { useUserSuggestions } from "../queries/use-github-queries.query";

export interface GitHubExplorerProps {
  className?: string;
}

export const GitHubExplorer = ({ className }: GitHubExplorerProps) => {
  const {
    selectedUsers,
    suggestionsQuery,
    setSuggestionsQuery,
    addSelectedUser,
    removeSelectedUser,
    stagedUsers,
    submitStagedUsers,
  } = useGitHubExplorer();

  const { data: userSuggestions = [], isLoading: isLoadingSuggestions } = useUserSuggestions(
    suggestionsQuery,
    5,
  );

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = useCallback((query: string): void => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setSuggestionsQuery(query.trim() || "");
    }, 300);
  }, [setSuggestionsQuery]);

  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion): void => {
    const user = userSuggestions.find(u => u.id === suggestion.id) || {
      id: typeof suggestion.id === "string" ? Number.parseInt(suggestion.id, 10) : suggestion.id,
      login: suggestion.value,
      avatar_url: suggestion.avatar || "",
      type: suggestion.subtitle === "User" ? "User" as const : "Organization" as const,
      html_url: `https://github.com/${suggestion.value}`,
      name: suggestion.label,
    };

    if (stagedUsers.length < 5) {
      addSelectedUser(user);
    }
  }, [userSuggestions, stagedUsers.length, addSelectedUser]);

  const suggestions: SearchSuggestion[] = useMemo(() => userSuggestions.map(user => ({
    id: user.id,
    label: user.login,
    subtitle: user.type === "User" ? "User" : "Organization",
    avatar: user.avatar_url,
    value: user.login,
  })), [userSuggestions]);

  const selectedSuggestions: SearchSuggestion[] = useMemo(() => stagedUsers.map(user => ({
    id: user.id,
    label: user.login,
    subtitle: user.type === "User" ? "User" : "Organization",
    avatar: user.avatar_url,
    value: user.login,
  })), [stagedUsers]);

  const handleRemoveSelectedUser = useCallback((suggestion: SearchSuggestion): void => {
    const user = stagedUsers.find(u => u.id === suggestion.id);

    if (user) {
      removeSelectedUser(user);
      submitStagedUsers();
    }
  }, [stagedUsers, removeSelectedUser, submitStagedUsers]);

  return (
    <div
      data-testid="github-explorer"
      className={`container p-4 max-w-5xl mx-auto min-h-screen bg-base-200 ${className || ""}`}
    >
      <div className="mx-auto">
        {stagedUsers.length === 5 && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <span className="font-semibold">Note:</span>
              {" "}
              You can select up to 5 users to explore their repositories.
            </div>
          </div>
        )}

        <SearchBar
          onSearch={submitStagedUsers}
          onInputChange={handleInputChange}
          placeholder="Enter username"
          isLoading={isLoadingSuggestions}
          suggestions={suggestions}
          onSuggestionSelect={handleSuggestionSelect}
          maxSuggestions={5}
          selectedItems={selectedSuggestions}
          onRemoveItem={handleRemoveSelectedUser}
        />
      </div>

      <main className="container mx-auto py-8">
        <section>
          <SelectedUserRepositories selectedUsers={selectedUsers} />
        </section>
      </main>
    </div>
  );
};

export default GitHubExplorer;
