import { zodResolver } from "@hookform/resolvers/zod";
import { GitHubUser, useUserSuggestions, usePrefetchUserRepositories } from "@repos-hub/shared-ui";
import { searchQuerySchema, SearchQueryInput } from "@repos-hub/shared-ui";
import { useCallback, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useGithubStore } from "../stores/github-users.store";

export const useSearch = () => {
  const { addSelectedUser, selectedUsers, removeSelectedUser } = useGithubStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SearchQueryInput>({
    resolver: zodResolver(searchQuerySchema),
    mode: "onChange",
    defaultValues: { query: "" },
  });
  const { register, setValue, watch } = form;
  const query = watch("query");

  const { data: userSuggestions = [], isLoading: isLoadingSuggestions } = useUserSuggestions(
    query,
    5,
  );
  const prefetchUserRepositories = usePrefetchUserRepositories();

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleInputChange = useCallback((query: string): void => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (query.trim().length > 0) {
        setValue("query", query);
      }
      else {
        setValue("query", "");
      }
    }, 300);
  }, [setValue]);

  const handleSelectSuggestion = useCallback((user: GitHubUser) => {
    if (selectedUsers.length < 5) {
      addSelectedUser(user);
      setValue("query", "");

      prefetchUserRepositories.mutate(user.login);
    }
  }, [selectedUsers.length, addSelectedUser, setValue, prefetchUserRepositories]);

  const handleFocusInput = useCallback(() => {
    setShowSuggestions(true);
  }, [setShowSuggestions]);

  const handleBlurInput = useCallback(() => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, [setShowSuggestions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    form,
    register,
    query,
    isLoadingSuggestions,
    userSuggestions,
    showSuggestions,
    inputRef,
    handleInputChange,
    handleSelectSuggestion,
    handleFocusInput,
    handleBlurInput,
    selectedUsers,
    addSelectedUser,
    removeSelectedUser,
  };
};
