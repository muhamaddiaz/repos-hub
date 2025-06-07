import type { ReactNode } from "react";

import type { GitHubUser } from "../types/github.types";

interface UserSectionCardProps {
  user: GitHubUser;
  repositoryCount?: number;
  children: ReactNode;
}

export const UserSectionCard = ({ user, repositoryCount, children }: UserSectionCardProps) => (
  <section className="card bg-base-100 shadow-xl" aria-labelledby={`user-${user.id}-heading`}>
    <div className="card-body">
      <header>
        <h3 id={`user-${user.id}-heading`} className="card-title flex items-center gap-3">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={user.avatar_url}
                alt={`${user.login} avatar`}
                loading="lazy"
              />
            </div>
          </div>
          <span>{user.login}</span>
          {repositoryCount !== undefined && (
            <div className="badge badge-secondary" aria-label={`${repositoryCount} repositories`}>
              {repositoryCount}
            </div>
          )}
        </h3>
      </header>
      {children}
    </div>
  </section>
);

export const RepositoryLoadingSkeleton = () => (
  <div className="space-y-4" role="status" aria-label="Loading repositories">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="card bg-base-200 animate-pulse">
          <div className="card-body">
            <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-base-300 rounded w-full mb-1"></div>
            <div className="h-3 bg-base-300 rounded w-2/3"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-base-300 rounded w-16"></div>
              <div className="h-6 bg-base-300 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <span className="sr-only">Loading user repositories...</span>
  </div>
);

interface RepositoryErrorStateProps {
  error: Error;
  onRetry?: () => void;
  userName: string;
}

export const RepositoryErrorState = ({ error, onRetry, userName }: RepositoryErrorStateProps) => (
  <div className="alert alert-error" role="alert">
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">
          {`Failed to load repositories for ${userName}`}
        </span>
      </div>

      <details className="text-sm opacity-80">
        <summary className="cursor-pointer hover:opacity-100">View error details</summary>
        <code className="block mt-2 p-2 bg-base-100 rounded text-xs">
          {error.message}
        </code>
      </details>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-sm btn-outline w-fit"
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

interface RepositoryEmptyStateProps {
  userName: string;
}

export const RepositoryEmptyState = ({ userName }: RepositoryEmptyStateProps) => (
  <div className="text-center py-12">
    <div className="mb-4">
      <svg
        className="w-16 h-16 mx-auto text-base-content/30"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    </div>
    <h4 className="text-lg font-medium text-base-content/70 mb-2">
      No Public Repositories
    </h4>
    <p className="text-base-content/50 max-w-sm mx-auto">
      {userName}
      {" "}
      doesn't have any public repositories or they may be private.
    </p>
  </div>
);
