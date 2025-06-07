import { githubApiService } from "@repos-hub/shared-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createTestQueryClient, createMockUser, createMockRepository } from "../../../test-utils";
import { useSearchUsers, useUserRepositories } from "./use-github-queries.query";

vi.mock("@repos-hub/shared-ui", () => ({
  githubApiService: {
    searchUsers: vi.fn(),
    getUserDetails: vi.fn(),
    getUserRepositories: vi.fn(),
  },
}));

const mockSearchUsers = vi.mocked(githubApiService.searchUsers);
const mockGetUserRepositories = vi.mocked(githubApiService.getUserRepositories);

describe("GitHub Query Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useSearchUsers", () => {
    it("should search users successfully", async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: ReactNode }) =>
        QueryClientProvider({ client: queryClient, children });

      const mockUsers = {
        items: [createMockUser()],
        total_count: 1,
        incomplete_results: false,
      };
      mockSearchUsers.mockResolvedValue(mockUsers);

      const { result } = renderHook(
        () => useSearchUsers("testuser"),
        { wrapper },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUsers);
      expect(mockSearchUsers).toHaveBeenCalledWith("testuser", 1, 10);
    });

    it("should not query when search term is too short", () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: ReactNode }) =>
        QueryClientProvider({ client: queryClient, children });

      const { result } = renderHook(
        () => useSearchUsers("a"),
        { wrapper },
      );

      expect(result.current.fetchStatus).toBe("idle");
      expect(result.current.data).toBeUndefined();
      expect(mockSearchUsers).not.toHaveBeenCalled();
    });
  });

  describe("useUserRepositories", () => {
    it("should fetch user repositories successfully", async () => {
      const queryClient = createTestQueryClient();
      const wrapper = ({ children }: { children: ReactNode }) =>
        QueryClientProvider({ client: queryClient, children });

      const mockRepos = [createMockRepository()];
      mockGetUserRepositories.mockResolvedValue(mockRepos);

      const { result } = renderHook(
        () => useUserRepositories("testuser"),
        { wrapper },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRepos);
      expect(mockGetUserRepositories).toHaveBeenCalledWith("testuser");
    });
  });
});
