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
      if (query.trim().length > 1) {
        setSuggestionsQuery(query);
      }
      else {
        setSuggestionsQuery("");
      }
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

    addSelectedUser(user);
    setSuggestionsQuery("");
  }, [userSuggestions, addSelectedUser, setSuggestionsQuery]);

  const suggestions: SearchSuggestion[] = useMemo(() => userSuggestions.map(user => ({
    id: user.id,
    label: user.login,
    subtitle: user.type === "User" ? "User" : "Organization",
    avatar: user.avatar_url,
    value: user.login,
  })), [userSuggestions]);

  const selectedSuggestions: SearchSuggestion[] = useMemo(() => selectedUsers.map(user => ({
    id: user.id,
    label: user.login,
    subtitle: user.type === "User" ? "User" : "Organization",
    avatar: user.avatar_url,
    value: user.login,
  })), [selectedUsers]);

  const handleRemoveSelectedUser = useCallback((suggestion: SearchSuggestion): void => {
    const user = selectedUsers.find(u => u.id === suggestion.id);

    if (user) {
      removeSelectedUser(user);
    }
  }, [selectedUsers, removeSelectedUser]);

  return (
    <div className={`container p-4 max-w-5xl mx-auto min-h-screen bg-base-200 ${className || ""}`}>
      <div className="mx-auto">
        <SearchBar
          onSearch={() => null}
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
