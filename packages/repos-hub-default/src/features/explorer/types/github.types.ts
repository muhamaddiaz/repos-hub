/**
 * GitHub API response types for the GitHub Explorer feature
 */

export interface GitHubUser {
  /** Unique identifier for the user */
  id: number;
  /** GitHub username */
  login: string;
  /** User's avatar URL */
  avatar_url: string;
  /** URL to user's GitHub profile */
  html_url: string;
  /** Account type (User or Organization) */
  type: string;
  /** User's display name */
  name?: string;
  /** User's bio/description */
  bio?: string;
  /** User's location */
  location?: string;
  /** Number of public repositories */
  public_repos?: number;
  /** Number of followers */
  followers?: number;
  /** Number of users following */
  following?: number;
}

export interface GitHubRepository {
  /** Unique identifier for the repository */
  id: number;
  /** Repository name */
  name: string;
  /** Full repository name (owner/repo) */
  full_name: string;
  /** Repository description */
  description: string | null;
  /** URL to repository on GitHub */
  html_url: string;
  /** Primary programming language */
  language: string | null;
  /** Number of stargazers */
  stargazers_count: number;
  /** Number of forks */
  forks_count: number;
  /** Last updated timestamp */
  updated_at: string;
  /** Repository topics/tags */
  topics: string[];
  /** Repository visibility (public/private) */
  visibility: string;
}

export interface SearchUsersResponse {
  /** Total number of users found */
  total_count: number;
  /** Whether results are incomplete */
  incomplete_results: boolean;
  /** Array of user results */
  items: GitHubUser[];
}

/** Error response from GitHub API */
export interface GitHubApiError {
  /** Error message */
  message: string;
  /** Error documentation URL */
  documentation_url?: string;
}
