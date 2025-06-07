import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { renderWithProviders, renderWithUser, createMockUser, createMockRepository } from "../../../test-utils";
import { useUserRepositories } from "../queries/use-github-queries.query";
import { SelectedUserRepositories } from "./selected-user-repositories.component";

// Mock the queries
vi.mock("../queries/use-github-queries.query", () => ({
  useUserRepositories: vi.fn(),
}));

const mockUseUserRepositories = vi.mocked(useUserRepositories);

describe("SelectedUserRepositories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing when no users are selected", () => {
    const { container } = renderWithProviders(<SelectedUserRepositories selectedUsers={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render user repositories", async () => {
    const mockUser = createMockUser({ login: "testuser" });
    const mockRepos = [
      createMockRepository({ name: "repo1", description: "First repo" }),
      createMockRepository({ name: "repo2", description: "Second repo" }),
    ];

    mockUseUserRepositories.mockReturnValue({
      data: mockRepos,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SelectedUserRepositories selectedUsers={[mockUser]} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("repo1")).toBeInTheDocument();
      expect(screen.getByText("repo2")).toBeInTheDocument();
    });
  });

  it("should show loading state", () => {
    const mockUser = createMockUser({ login: "testuser" });

    mockUseUserRepositories.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SelectedUserRepositories selectedUsers={[mockUser]} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Loading user repositories...")).toBeInTheDocument();
  });

  it("should show error state with retry functionality", async () => {
    const mockUser = createMockUser({ login: "testuser" });
    const mockRefetch = vi.fn();
    const mockError = new Error("Failed to load repositories");

    mockUseUserRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: mockRefetch,
    } as any);

    const { user } = renderWithUser(<SelectedUserRepositories selectedUsers={[mockUser]} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Failed to load repositories for testuser")).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /try again/i });
    await user.click(retryButton);

    expect(mockRefetch).toHaveBeenCalledOnce();
  });

  it("should show empty state when user has no repositories", () => {
    const mockUser = createMockUser({ login: "testuser" });

    mockUseUserRepositories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SelectedUserRepositories selectedUsers={[mockUser]} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("No Public Repositories")).toBeInTheDocument();
  });

  it("should render multiple users", () => {
    const mockUser1 = createMockUser({ id: 1, login: "user1" });
    const mockUser2 = createMockUser({ id: 2, login: "user2" });

    mockUseUserRepositories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SelectedUserRepositories selectedUsers={[mockUser1, mockUser2]} />);

    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const mockUser = createMockUser({ login: "testuser" });

    mockUseUserRepositories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(
      <SelectedUserRepositories selectedUsers={[mockUser]} className="custom-class" />,
    );

    const rootElement = screen.getByTestId("selected-user-repositories");
    expect(rootElement).toHaveClass("custom-class");
    expect(rootElement).toHaveClass("space-y-4");
  });
});
