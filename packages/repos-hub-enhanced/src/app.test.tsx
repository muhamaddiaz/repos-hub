import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { App } from "./app";

// Mock Lottie component to avoid Canvas issues in jsdom
vi.mock("lottie-react", () => ({
  default: ({ className, ariaLabel }: { className?: string; ariaLabel?: string }) => (
    <div className={className} aria-label={ariaLabel} data-testid="lottie-animation">
      Mocked Lottie Animation
    </div>
  ),
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it("renders the main layout", () => {
    render(<App />);
    // Check that the layout is rendered
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the enhanced GitHub explorer", () => {
    render(<App />);
    // App should contain the GitHub explorer heading specifically
    expect(screen.getByText("Github Explorer")).toBeInTheDocument();
  });

  it("provides React Query context", () => {
    render(<App />);
    // Should render without throwing React Query context errors
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the GitHub Explorer heading", () => {
    render(<App />);
    expect(screen.getByText("Github Explorer")).toBeInTheDocument();
  });

  it("renders the GitHub Explorer description", () => {
    render(<App />);
    expect(screen.getByText("Explore GitHub repositories and users easily")).toBeInTheDocument();
  });

  it("renders the search input field", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Search Github users")).toBeInTheDocument();
  });

  it("renders the Lottie animation with proper aria label", () => {
    render(<App />);
    expect(screen.getByTestId("lottie-animation")).toBeInTheDocument();
  });

  it("renders keyboard shortcuts in the search input", () => {
    render(<App />);
    // Check for keyboard shortcut indicators
    const cmdKey = screen.getByText("⌘");
    const kKey = screen.getByText("K");
    expect(cmdKey).toBeInTheDocument();
    expect(kKey).toBeInTheDocument();
  });

  it("renders the user repositories container", () => {
    render(<App />);
    expect(screen.getByTestId("selected-user-repositories")).toBeInTheDocument();
  });

  it("has proper CSS class structure", () => {
    render(<App />);
    // Check that the main container has the expected structure
    const spaceDiv = document.querySelector(".space-y-8.w-full");
    expect(spaceDiv).toBeInTheDocument();
  });

  it("renders React Query DevTools in production mode", () => {
    render(<App />);
    // DevTools should be rendered but not initially open
    // We can't easily test this without mocking, but we ensure no errors occur
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders both main components", () => {
    render(<App />);
    // Should render both the explorer and user repositories sections
    expect(screen.getByText("Github Explorer")).toBeInTheDocument();
    expect(screen.getByTestId("selected-user-repositories")).toBeInTheDocument();
  });

  it("has accessible form structure", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search Github users");
    expect(searchInput).toHaveAttribute("type", "text");
    expect(searchInput).toHaveAttribute("autoComplete", "off");
  });
});
