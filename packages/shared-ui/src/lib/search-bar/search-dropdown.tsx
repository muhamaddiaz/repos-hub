import clsx from "clsx";
import { forwardRef } from "react";

import type { SearchSuggestion } from ".";

interface SearchDropdownProps {
  isQueryValid: boolean;
  filteredSuggestions: SearchSuggestion[];
  selectedIndex: number;
  isLoading: boolean;
  error: string | null;
  emptyStateMessage: string;
  noResultsMessage: string;
  loadingMessage: string;
  minQueryLength: number;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  onMouseEnter: (index: number) => void;
}

export const SearchDropdown = forwardRef<HTMLDivElement, SearchDropdownProps>(
  ({
    isQueryValid,
    filteredSuggestions,
    selectedIndex,
    isLoading,
    error,
    emptyStateMessage,
    noResultsMessage,
    loadingMessage,
    minQueryLength,
    onSuggestionClick,
    onMouseEnter,
  }, ref) => {
    const renderContent = () => {
      if (error) {
        return (
          <div className="p-4 text-center text-error" role="alert">
            <div className="text-sm font-medium">Something went wrong</div>
            <div className="text-xs mt-1 opacity-70">{error}</div>
          </div>
        );
      }

      if (isLoading) {
        return (
          <div className="p-4 text-center text-base-content/60" role="status" aria-live="polite">
            <span className="loading loading-dots loading-md" />
            <div className="text-sm mt-2">{loadingMessage}</div>
          </div>
        );
      }

      if (!isQueryValid) {
        return (
          <div className="p-4 text-center text-base-content/60">
            <div className="text-sm">{emptyStateMessage}</div>
            {minQueryLength > 1 && (
              <div className="text-xs mt-1 opacity-70">
                Type at least
                {" "}
                {minQueryLength}
                {" "}
                characters
              </div>
            )}
          </div>
        );
      }

      if (filteredSuggestions.length === 0) {
        return (
          <div className="p-4 text-center text-base-content/60">
            <div className="text-sm font-medium">{noResultsMessage}</div>
            <div className="text-xs mt-1 opacity-70">Try a different search term</div>
          </div>
        );
      }

      return filteredSuggestions.map((suggestion, index) => (
        <button
          key={suggestion.id}
          type="button"
          className={clsx(
            "w-full px-4 py-3 text-left hover:bg-base-200 focus:bg-base-200 focus:outline-none transition-colors",
            {
              "bg-base-200": index === selectedIndex,
              "rounded-t-lg": index === 0,
              "rounded-b-lg": index === filteredSuggestions.length - 1,
            },
          )}
          onClick={() => onSuggestionClick(suggestion)}
          onMouseEnter={() => onMouseEnter(index)}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <div className="flex items-center gap-3">
            {suggestion.avatar && (
              <img
                src={suggestion.avatar}
                alt=""
                className="w-8 h-8 rounded-full"
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <div className="font-medium text-base-content">{suggestion.label}</div>
              {suggestion.subtitle && (
                <div className="text-sm text-base-content/60">{suggestion.subtitle}</div>
              )}
            </div>
          </div>
        </button>
      ));
    };

    return (
      <div
        ref={ref}
        className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        role="listbox"
        aria-label="Search suggestions"
      >
        {renderContent()}
      </div>
    );
  },
);
