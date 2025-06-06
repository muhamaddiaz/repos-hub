export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  visibility: string;
}

export interface RepoCardProps {
  repo: Repository;
  className?: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getLanguageColor = (language: string | null) => {
  const colors: Record<string, string> = {
    "JavaScript": "#f1e05a",
    "TypeScript": "#2b7489",
    "Python": "#3572A5",
    "Java": "#b07219",
    "C++": "#f34b7d",
    "C#": "#239120",
    "PHP": "#4F5D95",
    "Ruby": "#701516",
    "Go": "#00ADD8",
    "Rust": "#dea584",
    "Swift": "#ffac45",
    "Kotlin": "#F18E33",
    "Dart": "#00B4AB",
    "HTML": "#e34c26",
    "CSS": "#1572B6",
    "Shell": "#89e051",
  };
  return colors[language || ""] || "#6b7280";
};

export function RepoCard({ repo, className = "" }: RepoCardProps) {
  return (
    <div className={`card bg-base-100 shadow-lg hover:shadow-xl transition-shadow h-full ${className}`}>
      <div className="card-body p-6">
        <div className="flex items-start justify-between">
          <h3 className="card-title text-lg font-semibold text-primary hover:underline">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
          </h3>
          <div className="badge badge-outline badge-sm">
            {repo.visibility}
          </div>
        </div>

        {repo.description && (
          <p className="text-sm text-base-content/70 mt-2 line-clamp-3">
            {repo.description}
          </p>
        )}

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {repo.topics.slice(0, 3).map(topic => (
              <span key={topic} className="badge badge-sm bg-primary/10 text-primary border-primary/20">
                {topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="badge badge-sm badge-ghost">
                +
                {repo.topics.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="card-actions justify-between items-center mt-4">
          <div className="flex items-center gap-4 text-sm text-base-content/60">
            {repo.language && (
              <div className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                >
                </span>
                <span>{repo.language}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{repo.stargazers_count}</span>
            </div>

            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z" />
              </svg>
              <span>{repo.forks_count}</span>
            </div>
          </div>

          <div className="text-xs text-base-content/50">
            Updated
            {" "}
            {formatDate(repo.updated_at)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepoCard;
