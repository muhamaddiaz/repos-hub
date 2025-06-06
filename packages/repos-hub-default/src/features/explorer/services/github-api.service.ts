import type { GitHubUser, GitHubRepository, SearchUsersResponse } from "../types/github.types";

const GITHUB_API_BASE = "https://api.github.com" as const;

class GitHubApiService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("API rate limit exceeded. Please try again later.");
        }
        if (response.status === 404) {
          throw new Error("Resource not found.");
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json() as T;
    }
    catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  async searchUsers(
    query: string,
    page = 1,
    perPage = 10,
  ): Promise<SearchUsersResponse> {
    const url = `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(
      query,
    )}&page=${page}&per_page=${perPage}`;
    return this.fetchWithErrorHandling<SearchUsersResponse>(url);
  }

  async getUserDetails(username: string): Promise<GitHubUser> {
    const url = `${GITHUB_API_BASE}/users/${username}`;
    return this.fetchWithErrorHandling<GitHubUser>(url);
  }

  async getUserRepositories(
    username: string,
    page = 1,
    perPage = 30,
  ): Promise<GitHubRepository[]> {
    const url = `${GITHUB_API_BASE}/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`;
    return this.fetchWithErrorHandling<GitHubRepository[]>(url);
  }

  async getUserSuggestions(
    query: string,
    limit = 5,
  ): Promise<GitHubUser[]> {
    if (!query.trim()) {
      return [];
    }

    const url = `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(
      query,
    )}&per_page=${limit}`;

    const response = await this.fetchWithErrorHandling<SearchUsersResponse>(url);
    return response.items;
  }
}

export const githubApiService = new GitHubApiService();
