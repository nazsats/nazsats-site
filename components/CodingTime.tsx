"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CodingStats } from "../lib/coding-shared";
import { formatHours, formatClock, formatDayLabel } from "../lib/coding-shared";
import { AXIS_TEXT } from "../lib/chart-palette";
import CodingBars from "./CodingBars";
import CodingLanguages from "./CodingLanguages";

const RANGES = [
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
] as const;

/** How often a running stopwatch re-syncs with the server. */
const RESYNC_MS = 60_000;

type Props = { initial: CodingStats };

export default function CodingTime({ initial }: Props) {
  const [stats, setStats] = useState(initial);
  const [range, setRange] = useState<number>(initial.days.length > 45 ? 90 : 30);
  const [pending, setPending] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Seeded from the server's own timestamp so the first client render matches
  // the HTML exactly — starting from Date.now() would hydrate a different value.
  const [now, setNow] = useState(() => new Date(initial.generatedAt).getTime());

  const running = stats.running;
  const requestId = useRef(0);

  const load = useCallback(async (days: number) => {
    const id = ++requestId.current;
    setPending(true);
    try {
      const res = await fetch(`/api/coding?days=${days}`);
      if (!res.ok) return;
      const next: CodingStats = await res.json();
      // A slow earlier request must not overwrite a newer one.
      if (id !== requestId.current) return;
      setStats(next);
      setNow(new Date(next.generatedAt).getTime());
    } catch {
      // Keep the last good render rather than blanking the section.
    } finally {
      if (id === requestId.current) setPending(false);
    }
  }, []);

  // Tick only while a session is open — otherwise nothing on screen changes.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Re-sync periodically so the live number can't drift from the server's.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => load(range), RESYNC_MS);
    return () => clearInterval(id);
  }, [running, range, load]);

  function selectRange(days: number) {
    if (days === range) return;
    setRange(days);
    load(days);
  }

  // Seconds elapsed since the server computed these totals. The server already
  // counted the open session up to generatedAt, so only the delta is added —
  // adding the whole session would double-count it.
  const liveExtra = running
    ? Math.max(0, Math.floor((now - new Date(stats.generatedAt).getTime()) / 1000))
    : 0;

  const sessionElapsed = running
    ? Math.max(0, Math.floor((now - new Date(running.startedAt).getTime()) / 1000))
    : 0;

  const today = stats.totals.today + liveExtra;
  const week = stats.totals.week + liveExtra;

  const tableRows = useMemo(
    () => [...stats.days].reverse().filter((d) => d.seconds > 0),
    [stats.days]
  );

  return (
    <div>
      {/* Filter row — one row above everything it scopes */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => selectRange(r.days)}
              aria-pressed={range === r.days}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                range === r.days
                  ? "bg-orange-500/15 text-orange-400"
                  : "text-slate-500 hover:bg-slate-900/[0.035] hover:text-slate-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {running && (
            <span className="flex items-center gap-2 text-xs font-semibold text-orange-400">
              <span className="status-dot" style={{ width: 6, height: 6 }} />
              Coding now · <span className="tabular-nums">{formatClock(sessionElapsed)}</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            aria-pressed={showTable}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-900/[0.035] hover:text-slate-300 transition-colors"
          >
            {showTable ? "Show chart" : "Show table"}
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile label="Today" value={formatHours(today)} live={Boolean(running)} />
        <StatTile label="Last 7 days" value={formatHours(week)} />
        <StatTile
          label="Average working day"
          value={formatHours(stats.totals.dailyAverage)}
        />
        <StatTile
          label="Current streak"
          value={`${stats.totals.currentStreak} ${stats.totals.currentStreak === 1 ? "day" : "days"}`}
          hint={
            stats.totals.longestStreak > stats.totals.currentStreak
              ? `best ${stats.totals.longestStreak}`
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart / table */}
        <div className="glass-card lg:col-span-2">
          <h3 className="text-slate-200 font-bold text-sm mb-1">Hours per day</h3>
          <p className="text-slate-600 text-xs mb-6">
            {formatHours(stats.totals.window)} over the last {range} days ·{" "}
            {stats.totals.activeDays} active days
            {stats.degraded && " · live sync unavailable, showing last synced data"}
          </p>

          {showTable ? (
            <DayTable rows={tableRows} />
          ) : (
            <CodingBars days={stats.days} pending={pending} />
          )}
        </div>

        {/* Languages */}
        <div className="glass-card">
          <h3 className="text-slate-200 font-bold text-sm mb-1">Languages</h3>
          <p className="text-slate-600 text-xs mb-6">
            {/* Says the span it really covers — older archived days carry no
                per-language timings, so this is often shorter than the chart. */}
            {stats.languageDays > 0
              ? `Share of editor time · last ${stats.languageDays} ${
                  stats.languageDays === 1 ? "day" : "days"
                }`
              : "Share of editor time"}
          </p>
          <CodingLanguages slices={stats.languages} pending={pending} />
        </div>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  hint,
  live,
}: {
  label: string;
  value: string;
  hint?: string;
  live?: boolean;
}) {
  return (
    <div className="glass-card !p-5">
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: AXIS_TEXT }}>
          {label}
        </span>
        {live && <span className="status-dot" style={{ width: 5, height: 5 }} />}
      </div>
      {/* Proportional figures — tabular-nums would make a display-size number
          look loose. The table below is where digits need to align. */}
      <div className="text-2xl font-bold text-slate-200 mt-1.5">{value}</div>
      {hint && (
        <div className="text-xs mt-0.5" style={{ color: AXIS_TEXT }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/** The chart's accessible twin — the same values, readable without hover. */
function DayTable({
  rows,
}: {
  rows: { date: string; seconds: number; editorSeconds: number; manualSeconds: number }[];
}) {
  if (!rows.length) {
    return <p className="text-slate-600 text-xs">No coding time recorded in this range.</p>;
  }

  return (
    <div className="overflow-auto" style={{ maxHeight: 224 }}>
      <table className="w-full text-xs">
        <thead className="sticky top-0" style={{ background: "#FCFCFD" }}>
          <tr style={{ color: AXIS_TEXT }}>
            <th className="text-left font-semibold py-2">Day</th>
            <th className="text-right font-semibold py-2">Editor</th>
            <th className="text-right font-semibold py-2">Tracked</th>
            <th className="text-right font-semibold py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date} className="border-t border-slate-900/[0.07]">
              <td className="py-1.5 text-slate-400 whitespace-nowrap">
                {formatDayLabel(row.date)}
              </td>
              <td className="py-1.5 text-right text-slate-400 tabular-nums">
                {row.editorSeconds ? formatHours(row.editorSeconds) : "—"}
              </td>
              <td className="py-1.5 text-right text-slate-400 tabular-nums">
                {row.manualSeconds ? formatHours(row.manualSeconds) : "—"}
              </td>
              <td className="py-1.5 text-right text-slate-200 font-semibold tabular-nums">
                {formatHours(row.seconds)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
