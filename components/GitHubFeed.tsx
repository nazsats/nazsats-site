"use client";

interface Event {
  id: string;
  type: string;
  repo: string;
  repoFull: string;
  repoUrl: string;
  createdAt: string;
  message: string;
  commits: number;
}

interface Props { events: Event[] }

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function EventIcon({ type }: { type: string }) {
  const cls = "w-4 h-4";
  switch (type) {
    case "PushEvent":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    case "CreateEvent":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      );
    case "WatchEvent":
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    case "ForkEvent":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
  }
}

function eventColor(type: string): string {
  switch (type) {
    case "PushEvent":    return "text-purple-400 bg-purple-400/10";
    case "CreateEvent":  return "text-cyan-400 bg-cyan-400/10";
    case "WatchEvent":   return "text-yellow-400 bg-yellow-400/10";
    case "ForkEvent":    return "text-green-400 bg-green-400/10";
    default:             return "text-slate-400 bg-slate-400/10";
  }
}

export default function GitHubFeed({ events }: Props) {
  if (!events.length) {
    return <p className="text-slate-600 text-sm text-center py-4">No public activity found.</p>;
  }

  return (
    <div className="space-y-0">
      {events.map((ev, i) => (
        <div key={ev.id} className="relative flex gap-4 pb-5">
          {/* Timeline line */}
          {i < events.length - 1 && (
            <div className="absolute left-5 top-8 bottom-0 w-px bg-white/5" />
          )}

          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${eventColor(ev.type)} z-10`}>
            <EventIcon type={ev.type} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-1.5">
            <div className="flex items-baseline gap-2 flex-wrap">
              <a
                href={ev.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm font-semibold hover:text-purple-400 transition-colors truncate"
              >
                {ev.repo}
              </a>
              <span className="text-slate-600 text-xs flex-shrink-0">{timeAgo(ev.createdAt)}</span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5 truncate">{ev.message}</p>
            {ev.type === "PushEvent" && ev.commits > 1 && (
              <span className="text-xs text-slate-600">{ev.commits} commits</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}