import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createMockUser } from "../../../test-utils";
import { usePrefetchUserRepositories } from "../queries/use-github-queries.query";
import { useGitHubExplorer } from "./use-github-explorer.hook";

// Mock the prefetch hook
vi.mock("../queries/use-github-queries.query", () => ({
  usePrefetchUserRepositories: vi.fn(),
}));

const mockUsePrefetchUserRepositories = vi.mocked(usePrefetchUserRepositories);

describe("useGitHubExplorer", () => {
  const mockPrefetch = {
    mutate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePrefetchUserRepositories.mockReturnValue(mockPrefetch as any);
  });

  it("should initialize with empty state", () => {
    const { result } = renderHook(() => useGitHubExplorer());

    expect(result.current.selectedUsers).toEqual([]);
    expect(result.current.suggestionsQuery).toBe("");
  });

  it("should add a user to staged users", () => {
    const { result } = renderHook(() => useGitHubExplorer());
    const mockUser = createMockUser({ login: "testuser", id: 1 });

    act(() => {
      result.current.addSelectedUser(mockUser);
    });

    expect(result.current.stagedUsers).toHaveLength(1);
    expect(result.current.stagedUsers[0]).toEqual(mockUser);
    expect(result.current.selectedUsers).toHaveLength(0); // selectedUsers remains empty until submitted
    expect(mockPrefetch.mutate).toHaveBeenCalledWith("testuser");
  });

  it("should not add duplicate users to staged users", () => {
    const { result } = renderHook(() => useGitHubExplorer());
    const mockUser = createMockUser({ login: "testuser", id: 1 });

    act(() => {
      result.current.addSelectedUser(mockUser);
    });

    act(() => {
      result.current.addSelectedUser(mockUser);
    });

    expect(result.current.stagedUsers).toHaveLength(1);
    expect(mockPrefetch.mutate).toHaveBeenCalledTimes(1);
  });

  it("should add multiple different users to staged users", () => {
    const { result } = renderHook(() => useGitHubExplorer());
    const mockUser1 = createMockUser({ login: "user1", id: 1 });
    const mockUser2 = createMockUser({ login: "user2", id: 2 });

    act(() => {
      result.current.addSelectedUser(mockUser1);
    });

    act(() => {
      result.current.addSelectedUser(mockUser2);
    });

    expect(result.current.stagedUsers).toHaveLength(2);
    expect(result.current.stagedUsers).toContain(mockUser1);
    expect(result.current.stagedUsers).toContain(mockUser2);
    expect(mockPrefetch.mutate).toHaveBeenCalledTimes(2);
    expect(mockPrefetch.mutate).toHaveBeenCalledWith("user1");
    expect(mockPrefetch.mutate).toHaveBeenCalledWith("user2");
  });

  it("should handle staging and submitting users correctly", () => {
    const { result } = renderHook(() => useGitHubExplorer());
    const mockUser1 = createMockUser({ login: "user1", id: 1 });
    const mockUser2 = createMockUser({ login: "user2", id: 2 });

    // Add users to staging
    act(() => {
      result.current.addSelectedUser(mockUser1);
      result.current.addSelectedUser(mockUser2);
    });

    expect(result.current.stagedUsers).toHaveLength(2);
    expect(result.current.selectedUsers).toHaveLength(0); // Not yet submitted

    // Submit staged users
    act(() => {
      result.current.submitStagedUsers();
    });

    expect(result.current.selectedUsers).toHaveLength(2);
    expect(result.current.selectedUsers).toContain(mockUser1);
    expect(result.current.selectedUsers).toContain(mockUser2);
  });

  it("should remove a user from both staged and selected users", () => {
    const { result } = renderHook(() => useGitHubExplorer());
    const mockUser1 = createMockUser({ login: "user1", id: 1 });
    const mockUser2 = createMockUser({ login: "user2", id: 2 });

    // Stage and submit users
    act(() => {
      result.current.addSelectedUser(mockUser1);
      result.current.addSelectedUser(mockUser2);
      result.current.submitStagedUsers();
    });

    expect(result.current.selectedUsers).toHaveLength(2);

    // Remove one user
    act(() => {
      result.current.removeSelectedUser(mockUser1);
    });

    expect(result.current.selectedUsers).toHaveLength(1);
    expect(result.current.selectedUsers[0]).toEqual(mockUser2);
    expect(result.current.stagedUsers).toHaveLength(1);
    expect(result.current.stagedUsers[0]).toEqual(mockUser2);
  });

  it("should handle removing non-existent user gracefully", () => {
    const { result } = renderHook(() => useGitHubExplorer());
    const mockUser1 = createMockUser({ login: "user1", id: 1 });
    const mockUser2 = createMockUser({ login: "user2", id: 2 });

    act(() => {
      result.current.addSelectedUser(mockUser1);
      result.current.submitStagedUsers();
    });

    act(() => {
      result.current.removeSelectedUser(mockUser2); // Try to remove user that doesn't exist
    });

    expect(result.current.selectedUsers).toHaveLength(1);
    expect(result.current.selectedUsers[0]).toEqual(mockUser1);
  });

  it("should update suggestions query", () => {
    const { result } = renderHook(() => useGitHubExplorer());

    act(() => {
      result.current.setSuggestionsQuery("test query");
    });

    expect(result.current.suggestionsQuery).toBe("test query");
  });

  it("should maintain stable function references", () => {
    const { result } = renderHook(() => useGitHubExplorer());

    const initialAddUser = result.current.addSelectedUser;
    const initialRemoveUser = result.current.removeSelectedUser;
    const initialSetQuery = result.current.setSuggestionsQuery;

    act(() => {
      result.current.setSuggestionsQuery("test");
    });

    expect(result.current.addSelectedUser).toBe(initialAddUser);
    expect(result.current.removeSelectedUser).toBe(initialRemoveUser);
    expect(result.current.setSuggestionsQuery).toBe(initialSetQuery);
  });

  it("should handle complex state transitions", () => {
    const { result } = renderHook(() => useGitHubExplorer());
    const mockUser1 = createMockUser({ login: "user1", id: 1 });
    const mockUser2 = createMockUser({ login: "user2", id: 2 });
    const mockUser3 = createMockUser({ login: "user3", id: 3 });

    // Add users to staging
    act(() => {
      result.current.addSelectedUser(mockUser1);
      result.current.addSelectedUser(mockUser2);
      result.current.addSelectedUser(mockUser3);
    });

    // Submit staged users
    act(() => {
      result.current.submitStagedUsers();
    });

    // Set query
    act(() => {
      result.current.setSuggestionsQuery("search query");
    });

    // Remove middle user
    act(() => {
      result.current.removeSelectedUser(mockUser2);
    });

    expect(result.current.selectedUsers).toHaveLength(2);
    expect(result.current.selectedUsers).toContain(mockUser1);
    expect(result.current.selectedUsers).toContain(mockUser3);
    expect(result.current.selectedUsers).not.toContain(mockUser2);
    expect(result.current.suggestionsQuery).toBe("search query");
  });
});
