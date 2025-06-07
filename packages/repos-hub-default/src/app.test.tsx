import type { UseQueryResult } from "@tanstack/react-query";

import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { GitHubUser, GitHubRepository } from "./features/explorer/types/github.types";

import { GitHubExplorer } from "./features/explorer/containers/github-explorer.container";
import {
  useUserSuggestions,
  useUserRepositories,
  usePrefetchUserRepositories,
} from "./features/explorer/queries/use-github-queries.query";
import { renderWithUser, createMockUser, createMockRepository } from "./test-utils";

vi.mock("./features/explorer/queries/use-github-queries.query");

const mockUseUserSuggestions = vi.mocked(useUserSuggestions);
const mockUseUserRepositories = vi.mocked(useUserRepositories);
const mockUsePrefetchUserRepositories = vi.mocked(usePrefetchUserRepositories);

function createMockQueryResult<T>(data: T, overrides: Partial<UseQueryResult<T, Error>> = {}): UseQueryResult<T, Error> {
  return {
    data,
    error: null,
    isError: false,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    status: "success",
    refetch: vi.fn(),
    isPending: false,
    isFetching: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isPlaceholderData: false,
    isStale: false,
    fetchStatus: "idle",
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isInitialLoading: false,
    isRefetching: false,
    ...overrides,
  } as UseQueryResult<T, Error>;
}

describe("GitHub Explorer Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseUserSuggestions.mockReturnValue(
      createMockQueryResult<GitHubUser[]>([]),
    );

    mockUseUserRepositories.mockReturnValue(
      createMockQueryResult<GitHubRepository[]>([]),
    );

    // Mock the prefetch hook to return a function with mutate method
    mockUsePrefetchUserRepositories.mockReturnValue({
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof usePrefetchUserRepositories>);
  });

  it("should complete user search and selection workflow", async () => {
    const mockUsers = [
      createMockUser({ login: "johndoe", id: 1 }),
      createMockUser({ login: "janedoe", id: 2 }),
    ];

    mockUseUserSuggestions.mockReturnValue(
      createMockQueryResult(mockUsers),
    );

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "doe");

    await waitFor(() => {
      expect(screen.getByText("johndoe")).toBeInTheDocument();
      expect(screen.getByText("janedoe")).toBeInTheDocument();
    });

    await user.click(screen.getByText("johndoe"));

    await waitFor(() => {
      expect(screen.getByLabelText("Remove johndoe")).toBeInTheDocument();
    });
  });

  it("should handle multiple user selection and removal", async () => {
    const mockUsers = [
      createMockUser({ login: "user1", id: 1 }),
      createMockUser({ login: "user2", id: 2 }),
      createMockUser({ login: "user3", id: 3 }),
    ];

    mockUseUserSuggestions.mockReturnValue(
      createMockQueryResult(mockUsers),
    );

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");

    await user.type(searchInput, "user");
    await waitFor(() => expect(screen.getByText("user1")).toBeInTheDocument());
    await user.click(screen.getByText("user1"));

    await user.clear(searchInput);
    await user.type(searchInput, "user");
    await waitFor(() => expect(screen.getByText("user2")).toBeInTheDocument());
    await user.click(screen.getByText("user2"));

    await waitFor(() => {
      expect(screen.getByLabelText("Remove user1")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove user2")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Remove user1"));

    await waitFor(() => {
      expect(screen.queryByLabelText("Remove user1")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Remove user2")).toBeInTheDocument();
    });
  });

  it("should display repositories for selected users", async () => {
    const mockUser = createMockUser({ login: "testuser", id: 1 });
    const mockRepositories = [
      createMockRepository({ name: "repo1", id: 1 }),
      createMockRepository({ name: "repo2", id: 2 }),
    ];

    mockUseUserSuggestions.mockReturnValue(
      createMockQueryResult([mockUser]),
    );

    mockUseUserRepositories.mockReturnValue(
      createMockQueryResult(mockRepositories),
    );

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test");
    await waitFor(() => expect(screen.getByText("testuser")).toBeInTheDocument());
    await user.click(screen.getByText("testuser"));

    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
      expect(screen.getByText("repo2")).toBeInTheDocument();
    });
  });

  it("should handle loading states for user suggestions", async () => {
    mockUseUserSuggestions.mockReturnValue(
      createMockQueryResult<GitHubUser[]>([], { isLoading: true }),
    );

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test");

    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue("test");
  });

  it("should handle repository loading states", async () => {
    const mockUser = createMockUser({ login: "testuser", id: 1 });

    mockUseUserSuggestions.mockReturnValue(
      createMockQueryResult([mockUser]),
    );

    mockUseUserRepositories.mockReturnValue(
      createMockQueryResult<GitHubRepository[]>([], { isLoading: true }),
    );

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test");
    await waitFor(() => expect(screen.getByText("testuser")).toBeInTheDocument());
    await user.click(screen.getByText("testuser"));

    await waitFor(() => {
      expect(screen.getByRole("status", { name: "Loading repositories" })).toBeInTheDocument();
    });
  });

  it("should handle repository error states with retry", async () => {
    const mockUser = createMockUser({ login: "testuser", id: 1 });
    const mockRefetch = vi.fn();

    mockUseUserSuggestions.mockReturnValue(
      createMockQueryResult([mockUser]),
    );

    mockUseUserRepositories.mockReturnValue(
      createMockQueryResult<GitHubRepository[]>([], {
        error: new Error("Failed to fetch repositories"),
        isError: true,
        isSuccess: false,
        status: "error",
        refetch: mockRefetch,
      }),
    );

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test");
    await waitFor(() => expect(screen.getByText("testuser")).toBeInTheDocument());
    await user.click(screen.getByText("testuser"));

    await waitFor(() => {
      expect(screen.getByText("Failed to load repositories for testuser")).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Try Again"));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("should handle empty repository states", async () => {
    const mockUser = createMockUser({ login: "testuser", id: 1 });

    mockUseUserSuggestions.mockReturnValue(
      createMockQueryResult([mockUser]),
    );

    mockUseUserRepositories.mockReturnValue(
      createMockQueryResult<GitHubRepository[]>([]),
    );

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test");
    await waitFor(() => expect(screen.getByText("testuser")).toBeInTheDocument());
    await user.click(screen.getByText("testuser"));

    await waitFor(() => {
      expect(screen.getByText("No Public Repositories")).toBeInTheDocument();
    });
  });

  it("should prevent duplicate user selection", async () => {
    const mockUser = createMockUser({ login: "testuser", id: 1 });

    mockUseUserSuggestions.mockReturnValue(
      createMockQueryResult([mockUser]),
    );

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");

    await user.type(searchInput, "test");
    await waitFor(() => expect(screen.getAllByText("testuser")).toHaveLength(1));
    await user.click(screen.getByText("testuser"));

    await waitFor(() => {
      expect(screen.getByLabelText("Remove testuser")).toBeInTheDocument();
    });

    await user.clear(searchInput);
    await user.type(searchInput, "test");

    await waitFor(() => {
      const allTestuserElements = screen.queryAllByText("testuser");
      expect(allTestuserElements.length).toBeGreaterThanOrEqual(2);
    });

    expect(screen.getAllByLabelText("Remove testuser")).toHaveLength(1);
  });
});
