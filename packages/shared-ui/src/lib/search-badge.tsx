import type { SearchSuggestion } from "./search-bar";

export interface SearchBadgeProps {
  item: SearchSuggestion;
  onRemove: (item: SearchSuggestion) => void;
  className?: string;
}

export function SearchBadge({
  item,
  onRemove,
  className = "",
}: SearchBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm ${className}`}
    >
      {item.avatar && (
        <img
          src={item.avatar}
          alt={`${item.label} avatar`}
          className="w-5 h-5 rounded-full"
          loading="lazy"
        />
      )}
      <span>{item.label}</span>
      <button
        type="button"
        onClick={() => onRemove(item)}
        className="hover:text-primary-focus focus:outline-none ml-1 transition-colors"
        aria-label={`Remove ${item.label}`}
      >
        ×
      </button>
    </div>
  );
}

export default SearchBadge;
