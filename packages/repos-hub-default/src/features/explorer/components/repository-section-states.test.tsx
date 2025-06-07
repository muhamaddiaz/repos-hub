import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { renderWithProviders, renderWithUser, createMockUser } from "../../../test-utils";
import { UserSectionCard, RepositoryLoadingSkeleton, RepositoryErrorState, RepositoryEmptyState } from "./repository-section-states";

describe("Repository Section States", () => {
  describe("UserSectionCard", () => {
    it("should render user information correctly", () => {
      const mockUser = createMockUser({
        login: "testuser",
        avatar_url: "https://github.com/avatar.jpg",
      });

      renderWithProviders(
        <UserSectionCard user={mockUser}>
          <div>Test content</div>
        </UserSectionCard>,
      );

      expect(screen.getByText("testuser")).toBeInTheDocument();
      expect(screen.getByAltText("testuser avatar")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should display repository count when provided", () => {
      const mockUser = createMockUser({ login: "testuser" });

      renderWithProviders(
        <UserSectionCard user={mockUser} repositoryCount={5}>
          <div>Test content</div>
        </UserSectionCard>,
      );

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByLabelText("5 repositories")).toBeInTheDocument();
    });

    it("should not display repository count when not provided", () => {
      const mockUser = createMockUser({ login: "testuser" });

      renderWithProviders(
        <UserSectionCard user={mockUser}>
          <div>Test content</div>
        </UserSectionCard>,
      );

      expect(screen.queryByText("repositories")).not.toBeInTheDocument();
    });
  });

  describe("RepositoryLoadingSkeleton", () => {
    it("should render loading skeleton", () => {
      renderWithProviders(<RepositoryLoadingSkeleton />);

      expect(screen.getByText("Loading user repositories...")).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByLabelText("Loading repositories")).toBeInTheDocument();
    });
  });

  describe("RepositoryErrorState", () => {
    it("should render error state with retry button", () => {
      const mockRetry = vi.fn();
      const mockError = new Error("Failed to load repositories");
      renderWithProviders(<RepositoryErrorState onRetry={mockRetry} error={mockError} userName="testuser" />);

      expect(screen.getByText("Failed to load repositories for testuser")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });

    it("should call onRetry when retry button is clicked", async () => {
      const mockRetry = vi.fn();
      const mockError = new Error("Failed to load repositories");
      const { user } = renderWithUser(<RepositoryErrorState onRetry={mockRetry} error={mockError} userName="testuser" />);

      const retryButton = screen.getByRole("button", { name: /try again/i });
      await user.click(retryButton);

      expect(mockRetry).toHaveBeenCalledOnce();
    });
  });

  describe("RepositoryEmptyState", () => {
    it("should render empty state message", () => {
      renderWithProviders(<RepositoryEmptyState userName="testuser" />);

      expect(screen.getByText("No Public Repositories")).toBeInTheDocument();
      expect(screen.getByText(/testuser.*doesn't have any public repositories/)).toBeInTheDocument();
    });
  });
});
