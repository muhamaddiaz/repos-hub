export interface UserCardProps {
  user: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
    name?: string;
    bio?: string;
    location?: string;
    public_repos?: number;
    followers?: number;
    following?: number;
  };
  onSelect: (username: string) => void;
  className?: string;
}

export function UserCard({ user, onSelect, className = "" }: UserCardProps) {
  return (
    <div
      className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer ${className}`}
      onClick={() => onSelect(user.login)}
    >
      <figure className="px-6 pt-6">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="rounded-xl w-24 h-24 object-cover"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-lg">{user.login}</h2>
        {user.name && (
          <p className="text-sm text-base-content/70">{user.name}</p>
        )}
        {user.bio && (
          <p className="text-sm text-base-content/60 line-clamp-2">{user.bio}</p>
        )}

        <div className="flex gap-4 text-xs text-base-content/70 mt-2">
          {user.public_repos !== undefined && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
              </svg>
              {user.public_repos}
              {" "}
              repos
            </span>
          )}
          {user.followers !== undefined && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {user.followers}
            </span>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm">View Repos</button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
