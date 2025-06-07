import { queryClient } from "@repos-hub/shared-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { GitHubExplorer } from "./features/explorer/containers";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubExplorer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
