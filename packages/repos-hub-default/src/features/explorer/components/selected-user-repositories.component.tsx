import { Carousel, RepoCard } from "@repos-hub/shared-ui";
import { useCallback } from "react";

import type { GitHubUser } from "../types/github.types";

import { useUserRepositories } from "../queries/use-github-queries.query";
import {
  UserSectionCard,
  RepositoryLoadingSkeleton,
  RepositoryErrorState,
  RepositoryEmptyState,
} from "./repository-section-states";

export interface SelectedUserRepositoriesProps {
  selectedUsers: GitHubUser[];
  className?: string;
}

export const SelectedUserRepositories = ({
  selectedUsers,
  className,
}: SelectedUserRepositoriesProps) => {
  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {selectedUsers.map(user => (
        <UserRepositorySection key={user.id} user={user} />
      ))}
    </div>
  );
};

interface UserRepositorySectionProps {
  user: GitHubUser;
}

const UserRepositorySection = ({ user }: UserRepositorySectionProps) => {
  const { data: repositories, isLoading, error, refetch } = useUserRepositories(user.login);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <UserSectionCard user={user}>
        <RepositoryLoadingSkeleton />
      </UserSectionCard>
    );
  }

  if (error) {
    return (
      <UserSectionCard user={user}>
        <RepositoryErrorState
          error={error}
          onRetry={handleRetry}
          userName={user.login}
        />
      </UserSectionCard>
    );
  }

  if (!repositories || repositories.length === 0) {
    return (
      <UserSectionCard user={user}>
        <RepositoryEmptyState userName={user.login} />
      </UserSectionCard>
    );
  }

  return (
    <Carousel
      tabIndex={user.id}
      title={(
        <h3 className="card-title flex items-center gap-3">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={user.avatar_url}
                alt={`${user.login} avatar`}
                loading="lazy"
              />
            </div>
          </div>
          {user.login}
          <div className="badge badge-secondary" aria-label={`${repositories.length} repositories`}>
            {repositories.length}
          </div>
        </h3>
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repositories.map(repo => (
          <RepoCard
            key={repo.id}
            repo={repo}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default SelectedUserRepositories;
