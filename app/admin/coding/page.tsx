import AdminNav from "../AdminNav";
import { signOut } from "../actions";
import CodingTimerControl from "./CodingTimerControl";
import SessionRowActions from "./SessionRowActions";
import { getRunningSession, getRecentSessions, getCodingStats, formatHours } from "../../../lib/coding";

export const dynamic = "force-dynamic";

export default async function AdminCoding() {
  const [running, sessions, stats] = await Promise.all([
    getRunningSession(),
    getRecentSessions(25),
    getCodingStats(30).catch(() => null),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <AdminNav signOut={signOut} />

      <div className="mb-10">
        <h1 className="text-4xl font-black text-white">
          Coding <span className="gradient-text">Time</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {stats
            ? `${formatHours(stats.totals.today)} today · ${formatHours(stats.totals.week)} this week · ${stats.totals.currentStreak}-day streak`
            : "Stats unavailable"}
        </p>
      </div>

      <CodingTimerControl initial={running} />

      {/* Recent manual sessions */}
      <div className="glass-card mt-6">
        <h2 className="text-lg font-bold text-white mb-1">Recent sessions</h2>
        <p className="text-slate-500 text-sm mb-6">
          Manual entries only. Editor time syncs from WakaTime nightly and is not
          listed here.
        </p>

        {sessions.length === 0 ? (
          <p className="text-slate-600 text-sm">
            Nothing logged yet — start the stopwatch above.
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {sessions.map((session) => (
              <li key={session.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-slate-200 truncate">
                    {session.project || session.note || "Untitled session"}
                    {!session.endedAt && (
                      <span className="ml-2 text-xs text-orange-400 font-semibold">
                        running
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {new Date(session.startedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {session.project && session.note && ` · ${session.note}`}
                  </div>
                </div>

                <span className="text-sm text-slate-300 tabular-nums shrink-0">
                  {formatHours(session.seconds)}
                </span>

                <SessionRowActions id={session.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
