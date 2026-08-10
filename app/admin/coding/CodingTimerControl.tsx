"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { RunningSession } from "../../../lib/coding-shared";
import { formatClock, formatHours } from "../../../lib/coding-shared";

type Props = { initial: RunningSession | null };

export default function CodingTimerControl({ initial }: Props) {
  const router = useRouter();
  const [running, setRunning] = useState(initial);
  const [note, setNote] = useState("");
  const [project, setProject] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [now, setNow] = useState(() => (initial ? new Date(initial.startedAt).getTime() : 0));

  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  const elapsed = running
    ? Math.max(0, Math.floor((now - new Date(running.startedAt).getTime()) / 1000))
    : 0;

  async function send(action: "start" | "stop") {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/coding/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note, project }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error ?? "Something went wrong.", error: true });
        // A 409 means our view of the timer was stale — pull the real state.
        if (res.status === 409) router.refresh();
        return;
      }

      setRunning(data.running ?? null);
      if (action === "start") {
        setMessage({ text: "Timer started.", error: false });
      } else {
        setNote("");
        setProject("");
        setMessage({ text: `Logged ${data.logged}.`, error: false });
      }
      // The homepage totals are cached; nudge this page's data too.
      router.refresh();
    } catch {
      setMessage({ text: "Network error — the timer was not changed.", error: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-card">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Stopwatch</h2>
          <p className="text-slate-500 text-sm">
            For coding that happens away from the editor — WakaTime can&apos;t see
            whiteboarding, docs, or debugging on paper.
          </p>
        </div>

        <div className="text-right">
          <div
            className="text-3xl font-bold tabular-nums"
            style={{ color: running ? "#FF7A00" : "#4a3858" }}
          >
            {formatClock(elapsed)}
          </div>
          {running && (
            <div className="text-xs text-slate-500 mt-1">
              since{" "}
              {new Date(running.startedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>

      {!running && (
        <div className="flex gap-3 flex-wrap mt-6">
          <input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Project (optional)"
            maxLength={120}
            className="flex-1 min-w-[180px] rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What are you working on? (private)"
            maxLength={200}
            className="flex-1 min-w-[220px] rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
          />
        </div>
      )}

      {running && (running.project || running.note) && (
        <p className="text-slate-400 text-sm mt-4">
          {running.project && <span className="text-orange-400">{running.project}</span>}
          {running.project && running.note && " · "}
          {running.note}
        </p>
      )}

      <div className="flex items-center gap-4 mt-6 flex-wrap">
        <button
          type="button"
          disabled={busy}
          onClick={() => send(running ? "stop" : "start")}
          className={running ? "btn-secondary" : "btn-primary"}
        >
          {busy ? "Working…" : running ? "Stop timer" : "Start timer →"}
        </button>

        {message && (
          <span
            className={`text-sm ${message.error ? "text-red-400" : "text-green-400"}`}
            role="status"
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}

/** Small helper reused by the recent-sessions list on the page. */
export function SessionDuration({ seconds }: { seconds: number }) {
  return <span className="tabular-nums">{formatHours(seconds)}</span>;
}
