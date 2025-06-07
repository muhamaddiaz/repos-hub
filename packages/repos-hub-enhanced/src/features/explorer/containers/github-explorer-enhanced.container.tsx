import Lottie from "lottie-react";

import rocketLottie from "../../../assets/rocket.json";
import { DropdownUsers } from "../components/dropdown-users.component";
import { useSearch } from "../hooks/use-search.hook";

export const GithubExplorerEnhanced = () => {
  const {
    handleFocusInput,
    handleBlurInput,
    handleInputChange,
    handleSelectSuggestion,
    isLoadingSuggestions,
    inputRef,
    query,
    register,
    removeSelectedUser,
    selectedUsers,
    showSuggestions,
    userSuggestions,
  } = useSearch();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div>
          <Lottie
            animationData={rocketLottie}
            loop={true}
            className="w-32 h-32 mx-auto mb-4"
            aria-label="Rocket animation"
          />
          <div className="mt-[-1rem] space-y-2">
            <h2 className="text-4xl">Github Explorer</h2>
            <p className="text-slate-400">Explore GitHub repositories and users easily</p>
          </div>
        </div>

        {selectedUsers.length === 5 && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <span className="font-semibold">Note:</span>
              {" "}
              You can select up to 5 users to explore their repositories.
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-center">
          {selectedUsers.map(user => (
            <div key={user.id} className="badge badge-soft badge-info">
              <img src={user.avatar_url} alt={user.login} className="w-6 h-6 rounded-full inline-block mr-2" />
              {user.login}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeSelectedUser(user)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="relative w-full">
        <form className="flex flex-col lg:flex-row gap-4">
          <label className="input w-full rounded-full">
            <input
              {...register("query")}
              ref={inputRef}
              type="text"
              placeholder="Search Github users"
              autoComplete="off"
              className="grow rounded-full"
              onChange={e => handleInputChange(e.target.value)}
              onFocus={handleFocusInput}
              onBlur={handleBlurInput}
            />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
        </form>
        {query && showSuggestions && (
          <DropdownUsers
            query={query}
            userSuggestions={userSuggestions}
            isLoading={isLoadingSuggestions}
            handleSelectSuggestion={handleSelectSuggestion}
          />
        )}
      </div>
    </div>
  );
};
