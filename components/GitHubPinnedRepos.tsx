interface Repo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string;
  topics: string[];
}

interface Props { repos: Repo[] }

export default function GitHubPinnedRepos({ repos }: Props) {
  if (!repos.length) {
    return (
      <p className="text-slate-600 text-sm text-center py-8">
        No public repositories found. Add a{" "}
        <code className="text-orange-400">GITHUB_TOKEN</code> env var to show pinned repos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {repos.map((repo) => (
        <a
          key={repo.name}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card flex flex-col gap-3 group no-underline"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="text-white font-bold text-sm group-hover:text-purple-400 transition-colors truncate">
                {repo.name}
              </span>
            </div>
            <svg className="w-4 h-4 text-slate-600 group-hover:text-purple-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-xs leading-relaxed flex-1 line-clamp-2">
            {repo.description || "No description provided."}
          </p>

          {/* Topics */}
          {repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.slice(0, 3).map((t) => (
                <span key={t} className="text-xs text-slate-600 border border-white/5 bg-white/3 px-2 py-0.5 rounded-md">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 pt-1 border-t border-white/5">
            {repo.language && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: repo.languageColor }} />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {repo.stars}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {repo.forks}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}