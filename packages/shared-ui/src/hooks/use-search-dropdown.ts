import { useState, useMemo, KeyboardEvent } from "react";

import type { SearchSuggestion } from "../lib/search-bar";

interface UseSearchDropdownProps {
  query: string;
  suggestions: SearchSuggestion[];
  selectedItems: SearchSuggestion[];
  maxSuggestions: number;
  minQueryLength: number;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
}

export function useSearchDropdown({
  query,
  suggestions,
  selectedItems,
  maxSuggestions,
  minQueryLength,
  onSuggestionSelect,
}: UseSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const selectedIds = useMemo(() => {
    return new Set(selectedItems.map(item => item.id));
  }, [selectedItems]);

  const isQueryValid = useMemo(() =>
    query.trim().length >= minQueryLength,
  [query, minQueryLength],
  );

  const filteredSuggestions = useMemo(() => {
    if (!isQueryValid) return [];

    return suggestions
      .filter(suggestion =>
        suggestion.label.toLowerCase().includes(query.toLowerCase())
        || suggestion.value.toLowerCase().includes(query.toLowerCase()),
      )
      .filter(suggestion => !selectedIds.has(suggestion.id))
      .slice(0, maxSuggestions);
  }, [query, suggestions, selectedIds, maxSuggestions, isQueryValid]);

  const shouldShowDropdown = useMemo(() =>
    isOpen && (isQueryValid || selectedItems.length === 0),
  [isOpen, isQueryValid, selectedItems.length],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1,
        );
        break;
      }
      case "Enter": {
        if (selectedIndex >= 0) {
          e.preventDefault();
          onSuggestionSelect(filteredSuggestions[selectedIndex]);
        }
        break;
      }
      case "Escape": {
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      }
    }
  };

  const open = () => setIsOpen(true);
  const close = () => {
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const resetSelection = () => setSelectedIndex(-1);

  return {
    isOpen,
    selectedIndex,
    filteredSuggestions,
    shouldShowDropdown,
    isQueryValid,
    handleKeyDown,
    open,
    close,
    resetSelection,
    setSelectedIndex,
  };
}
