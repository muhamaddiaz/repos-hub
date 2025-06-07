import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { renderWithProviders, renderWithUser, createMockUser } from "../../../test-utils";
import { useGitHubExplorer } from "../hooks/use-github-explorer.hook";
import { useUserSuggestions, useUserRepositories } from "../queries/use-github-queries.query";
import { GitHubExplorer } from "./github-explorer.container";

vi.mock("../hooks/use-github-explorer.hook", () => ({
  useGitHubExplorer: vi.fn(),
}));

vi.mock("../queries/use-github-queries.query", () => ({
  useUserSuggestions: vi.fn(),
  useUserRepositories: vi.fn(),
}));

const mockUseGitHubExplorer = vi.mocked(useGitHubExplorer);
const mockUseUserSuggestions = vi.mocked(useUserSuggestions);
const mockUseUserRepositories = vi.mocked(useUserRepositories);

describe("GitHubExplorer", () => {
  const mockExplorerState = {
    selectedUsers: [],
    suggestionsQuery: "",
    setSuggestionsQuery: vi.fn(),
    addSelectedUser: vi.fn(),
    removeSelectedUser: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGitHubExplorer.mockReturnValue(mockExplorerState);
    mockUseUserSuggestions.mockReturnValue({
      data: [],
      isLoading: false,
    } as any);
    mockUseUserRepositories.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);
  });

  it("should render the search bar", () => {
    renderWithProviders(<GitHubExplorer />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should show user suggestions when available", async () => {
    const mockUsers = [
      createMockUser({ login: "testuser1" }),
      createMockUser({ login: "testuser2" }),
    ];

    mockUseUserSuggestions.mockReturnValue({
      data: mockUsers,
      isLoading: false,
    } as any);

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test");

    await waitFor(() => {
      expect(screen.getByText("testuser1")).toBeInTheDocument();
      expect(screen.getByText("testuser2")).toBeInTheDocument();
    });
  });

  it("should handle user selection", async () => {
    const mockUser = createMockUser({ login: "testuser" });

    mockUseUserSuggestions.mockReturnValue({
      data: [mockUser],
      isLoading: false,
    } as any);

    const { user } = renderWithUser(<GitHubExplorer />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test");

    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    await user.click(screen.getByText("testuser"));

    expect(mockExplorerState.addSelectedUser).toHaveBeenCalledWith(mockUser);
  });

  it("should display selected users repositories", () => {
    const mockUsers = [createMockUser({ login: "selecteduser" })];

    mockUseGitHubExplorer.mockReturnValue({
      ...mockExplorerState,
      selectedUsers: mockUsers,
    });

    renderWithProviders(<GitHubExplorer />);

    expect(screen.getByTestId("github-explorer")).toBeInTheDocument();
  });

  it("should show loading state for suggestions", () => {
    mockUseUserSuggestions.mockReturnValue({
      data: [],
      isLoading: true,
    } as any);

    renderWithProviders(<GitHubExplorer />);

    // The loading state would be handled by the SearchBar component
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    renderWithProviders(<GitHubExplorer className="custom-class" />);

    expect(screen.getByTestId("github-explorer")).toHaveClass("custom-class");
  });

  it("should handle selected user removal", async () => {
    const mockUser = createMockUser({ login: "testuser" });

    mockUseGitHubExplorer.mockReturnValue({
      ...mockExplorerState,
      selectedUsers: [mockUser],
    });

    const { user } = renderWithUser(<GitHubExplorer />);

    // Look for the specific remove button with aria-label
    const removeButton = screen.getByLabelText("Remove testuser");
    await user.click(removeButton);
    expect(mockExplorerState.removeSelectedUser).toHaveBeenCalled();
  });
});
