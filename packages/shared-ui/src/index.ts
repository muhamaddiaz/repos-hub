import "./styles.css";

export * from "./lib/input";
export * from "./lib/button";
export * from "./lib/carousel";
export * from "./lib/search-bar";
export * from "./lib/user-card";
export * from "./lib/repo-card";
export * from "./lib/carousel";
export * from "./lib/layout";

export * from "./services/github-api.service";
export * from "./queries/use-github.query";
export * from "./react-query";
export * from "./types/github.type";
export * from "./schemas/search.schema";

export { SearchBadge } from "./lib/search-bar/search-badge";
export type { SearchBadgeProps } from "./lib/search-bar/search-badge";

// Test comment for shared-ui lint-staged
export * from "./lib";
