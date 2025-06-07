import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { githubApiService } from "./github-api.service";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("githubApiService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("searchUsers", () => {
    it("should fetch users successfully", async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            login: "testuser",
            name: "Test User",
            avatar_url: "https://github.com/avatar.jpg",
            html_url: "https://github.com/testuser",
            public_repos: 10,
            followers: 5,
            following: 3,
          },
        ],
        total_count: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await githubApiService.searchUsers("testuser");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.github.com/search/users?q=testuser&page=1&per_page=10",
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(githubApiService.searchUsers("nonexistent")).rejects.toThrow(
        "Resource not found.",
      );
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(githubApiService.searchUsers("testuser")).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("getUserDetails", () => {
    it("should fetch user details successfully", async () => {
      const mockUser = {
        id: 1,
        login: "testuser",
        name: "Test User",
        avatar_url: "https://github.com/avatar.jpg",
        html_url: "https://github.com/testuser",
        public_repos: 10,
        followers: 5,
        following: 3,
        bio: "Test bio",
        location: "Test City",
        company: "Test Company",
        blog: "https://testuser.dev",
        twitter_username: "testuser",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await githubApiService.getUserDetails("testuser");

      expect(mockFetch).toHaveBeenCalledWith("https://api.github.com/users/testuser");
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserRepositories", () => {
    it("should fetch user repositories successfully", async () => {
      const mockRepos = [
        {
          id: 1,
          name: "test-repo",
          full_name: "testuser/test-repo",
          description: "A test repository",
          html_url: "https://github.com/testuser/test-repo",
          stargazers_count: 10,
          forks_count: 5,
          language: "TypeScript",
          updated_at: "2024-01-01T00:00:00Z",
          topics: ["react", "typescript"],
          fork: false,
          archived: false,
          disabled: false,
          private: false,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      const result = await githubApiService.getUserRepositories("testuser");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.github.com/users/testuser/repos?page=1&per_page=30&sort=updated",
      );
      expect(result).toEqual(mockRepos);
    });
  });

  describe("rate limit handling", () => {
    it("should handle rate limit errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        headers: new Headers({
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": "1640995200",
        }),
      });

      await expect(githubApiService.searchUsers("testuser")).rejects.toThrow(
        "API rate limit exceeded. Please try again later.",
      );
    });
  });
});
