import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement, ReactNode } from "react";

import { GitHubUser, GitHubRepository } from "./features/explorer/types/github.types";

export const createMockUser = (overrides: Partial<GitHubUser> = {}): GitHubUser => ({
  id: 1,
  login: "testuser",
  name: "Test User",
  avatar_url: "https://github.com/avatar.jpg",
  html_url: "https://github.com/testuser",
  type: "User",
  public_repos: 10,
  followers: 5,
  following: 3,
  bio: "Test bio",
  location: "Test City",
  ...overrides,
});

export const createMockRepository = (overrides: Partial<GitHubRepository> = {}): GitHubRepository => ({
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
  visibility: "public",
  ...overrides,
});

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

interface TestProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

const TestProviders = ({ children, queryClient = createTestQueryClient() }: TestProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {},
): ReturnType<typeof render> => {
  const { queryClient, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders queryClient={queryClient}>
      {children}
    </TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

interface CustomRenderResult extends ReturnType<typeof render> {
  user: ReturnType<typeof userEvent.setup>;
}

export const renderWithUser = (
  ui: ReactElement,
  options: CustomRenderOptions = {},
): CustomRenderResult => {
  const user = userEvent.setup();
  const renderResult = renderWithProviders(ui, options);

  return {
    ...renderResult,
    user,
  };
};

export { renderWithProviders as render };
