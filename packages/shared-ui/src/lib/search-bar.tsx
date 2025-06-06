import clsx from "clsx";
import { useRef, useCallback } from "react";

import { useSearchDropdown } from "../hooks/use-search-dropdown";
import { useSearchForm } from "../hooks/use-search-form";
import { SearchBadge } from "./search-badge";
import { SearchDropdown } from "./search-dropdown";

export interface SearchSuggestion {
  id: string | number;
  label: string;
  subtitle?: string;
  avatar?: string;
  value: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  onInputChange?: (query: string) => void;
  maxSuggestions?: number;
  selectedItems?: SearchSuggestion[];
  onSelectedItemsChange?: (items: SearchSuggestion[]) => void;
  onRemoveItem?: (item: SearchSuggestion) => void;
  error?: string | null;
  emptyStateMessage?: string;
  noResultsMessage?: string;
  loadingMessage?: string;
  minQueryLength?: number;
}

export function SearchBar({
  onSearch,
  placeholder = "Search GitHub users...",
  className = "",
  suggestions = [],
  onSuggestionSelect,
  onInputChange,
  maxSuggestions = 5,
  selectedItems = [],
  onSelectedItemsChange,
  onRemoveItem,
  isLoading = false,
  error = null,
  emptyStateMessage = "Start typing to see suggestions",
  noResultsMessage = "No users found matching your search",
  loadingMessage = "Searching users...",
  minQueryLength = 1,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, query, resetQuery, currentError, formState } = useSearchForm({
    onInputChange,
    onSearch,
    error,
  });

  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    const newSelectedItems = [...selectedItems, suggestion];
    onSelectedItemsChange?.(newSelectedItems);
    resetQuery();
    onSuggestionSelect?.(suggestion);
  }, [selectedItems, onSelectedItemsChange, resetQuery, onSuggestionSelect]);

  const dropdown = useSearchDropdown({
    query,
    suggestions,
    selectedItems,
    maxSuggestions,
    minQueryLength,
    onSuggestionSelect: handleSuggestionSelect,
  });

  const handleRemoveItem = useCallback((itemToRemove: SearchSuggestion) => {
    const newSelectedItems = selectedItems.filter(item => item.id !== itemToRemove.id);
    onSelectedItemsChange?.(newSelectedItems);
    onRemoveItem?.(itemToRemove);
  }, [selectedItems, onSelectedItemsChange, onRemoveItem]);

  return (
    <div className={clsx("relative w-full space-y-2", className)}>
      <form onSubmit={handleSubmit} className="flex lg:flex-row flex-col gap-2 w-full">
        <div className="flex-1 relative">
          <div className="relative">
            <input
              {...register("query")}
              ref={(e) => {
                register("query").ref(e);
                inputRef.current = e;
              }}
              type="text"
              placeholder={selectedItems.length > 0 ? "Add more username" : placeholder}
              className={clsx("input input-bordered w-full", {
                "input-error": currentError,
                "pr-10": isLoading,
              })}
              autoComplete="off"
              onFocus={dropdown.open}
              onBlur={dropdown.close}
              onKeyDown={dropdown.handleKeyDown}
            />

            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="loading loading-spinner loading-sm" />
              </div>
            )}
          </div>

          {currentError && !dropdown.isOpen && (
            <div className="text-error text-xs mt-1" role="alert">
              {currentError}
            </div>
          )}

          {dropdown.shouldShowDropdown && (
            <SearchDropdown
              ref={dropdownRef}
              isQueryValid={dropdown.isQueryValid}
              filteredSuggestions={dropdown.filteredSuggestions}
              selectedIndex={dropdown.selectedIndex}
              isLoading={isLoading}
              error={error}
              emptyStateMessage={emptyStateMessage}
              noResultsMessage={noResultsMessage}
              loadingMessage={loadingMessage}
              minQueryLength={minQueryLength}
              onSuggestionClick={handleSuggestionSelect}
              onMouseEnter={dropdown.setSelectedIndex}
            />
          )}
        </div>

        <button
          type="submit"
          className={clsx("btn btn-primary", { loading: isLoading })}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm">Showing users for:</p>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map(item => (
              <SearchBadge
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                className="badge badge-soft badge-primary"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
