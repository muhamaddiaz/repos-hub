import { zodResolver } from "@hookform/resolvers/zod";
import { GitHubUser, useUserSuggestions, usePrefetchUserRepositories } from "@repos-hub/shared-ui";
import Lottie from "lottie-react";
import { searchQuerySchema } from "packages/shared-ui/src/schemas/search.schema";
import { useCallback, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import rocketLottie from "../../../assets/rocket.json";
import { DropdownUsers } from "../components/dropdown-users.component";
import { useGithubStore } from "../stores/github-users.store";

interface SearchQueryInput {
  query: string;
}

export const GithubExplorerEnhanced = () => {
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
    addSelectedUser(user);
    setValue("query", "");

    prefetchUserRepositories.mutate(user.login);
  }, [addSelectedUser, setValue, prefetchUserRepositories]);

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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div>
          <Lottie
            animationData={rocketLottie}
            loop={true}
            className="w-32 h-32 mx-auto mb-4"
            aria-label="Rocket animation"
          />
          <div className="mt-[-1rem] space-y-2">
            <h2 className="text-4xl">Github Explorer</h2>
            <p className="text-slate-400">Explore GitHub repositories and users easily</p>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          {selectedUsers.map(user => (
            <div key={user.id} className="badge badge-soft badge-info">
              <img src={user.avatar_url} alt={user.login} className="w-6 h-6 rounded-full inline-block mr-2" />
              {user.login}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeSelectedUser(user)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="relative w-full">
        <form className="flex flex-col lg:flex-row gap-4">
          <label className="input w-full rounded-full">
            <input
              {...register("query")}
              ref={inputRef}
              type="text"
              placeholder="Search Github users"
              autoComplete="off"
              className="grow rounded-full"
              onChange={e => handleInputChange(e.target.value)}
              onFocus={handleFocusInput}
              onBlur={handleBlurInput}
            />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
        </form>
        {query && showSuggestions && (
          <DropdownUsers
            query={query}
            userSuggestions={userSuggestions}
            isLoading={isLoadingSuggestions}
            handleSelectSuggestion={handleSelectSuggestion}
          />
        )}
      </div>
    </div>
  );
};
