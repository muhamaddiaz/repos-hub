/**
 * GitHub Explorer feature main export
 * Provides centralized access to the GitHub Explorer feature
 */

// Components
export * from "./components";

// Hooks
export { useGitHubExplorer } from "./hooks/use-github-explorer.hook";
export type { UseGitHubExplorerReturn } from "./hooks/use-github-explorer.hook";

// Services
export { githubApiService } from "./services/github-api.service";

// Types
export * from "./types/github.types";
