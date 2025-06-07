export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  name?: string;
  bio?: string;
  location?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  visibility: string;
}

export interface SearchUsersResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}
