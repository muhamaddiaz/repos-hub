import { GitHubUser } from "@repos-hub/shared-ui";

interface DropdownUsersProps {
  query: string;
  userSuggestions: GitHubUser[];
  isLoading: boolean;
  handleSelectSuggestion: (user: GitHubUser) => void;
}

export const DropdownUsers = ({ query, isLoading, userSuggestions, handleSelectSuggestion }: DropdownUsersProps) => {
  if (!query) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 w-full shadow-lg rounded-lg p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoading && userSuggestions.length === 0) {
    return (
      <div className="absolute top-full left-0 w-full shadow-lg rounded-lg p-4">
        <p>
          No results found for "
          {query}
          "
        </p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 w-full border-slate-700 bg-gray-800 border-[1px] border-t-0 shadow-lg rounded-lg p-4 z-20">
      <ul className="space-y-2">
        {userSuggestions.map(user => (
          <li key={user.id} onClick={() => handleSelectSuggestion(user)} className="flex items-center space-x-3 p-2 hover:bg-slate-900 cursor-pointer rounded-lg">
            <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-semibold">{user.login}</p>
              <p className="text-sm text-gray-600">{user.type}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
