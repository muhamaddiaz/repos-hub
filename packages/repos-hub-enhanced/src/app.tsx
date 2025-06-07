import "./styles.css";

// Test comment for repos-hub-enhanced lint-staged
import { Layout, queryClient } from "@repos-hub/shared-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { GithubExplorerEnhanced } from "./features/explorer/containers/github-explorer-enhanced.container";
import { UserRepositories } from "./features/explorer/containers/user-repositories.container";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <div className="space-y-8 w-full">
          <GithubExplorerEnhanced />
          <UserRepositories />
        </div>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
