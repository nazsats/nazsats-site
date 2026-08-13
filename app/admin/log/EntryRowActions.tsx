"use client";

import { useState, useTransition } from "react";
import {
  toggleResumeWorthy,
  markReviewed,
  saveResumeBullet,
  deleteEntry,
} from "./actions";

export default function EntryRowActions({
  id,
  resumeWorthy,
  reviewed,
  bullet,
}: {
  id: string;
  resumeWorthy: boolean;
  reviewed: boolean;
  bullet: string | null;
}) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(bullet ?? "");

  return (
    <div className="flex flex-col items-end gap-2 flex-shrink-0">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => toggleResumeWorthy(id, !resumeWorthy))}
          title={resumeWorthy ? "On the CV — click to remove" : "Add to the CV"}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${
            resumeWorthy
              ? "bg-orange-500/15 text-orange-400 border border-orange-400/30"
              : "bg-slate-900/[0.035] text-slate-400 hover:bg-slate-900/[0.06] border border-transparent"
          }`}
        >
          {resumeWorthy ? "★ On CV" : "☆ CV"}
        </button>

        {!reviewed && (
          <button
            type="button"
            disabled={pending}
            onClick={() => start(() => markReviewed(id))}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/[0.035] text-slate-400 hover:bg-slate-900/[0.06] transition-colors disabled:opacity-50"
          >
            Skip
          </button>
        )}

        <button
          type="button"
          disabled={pending}
          onClick={() => setEditing((v) => !v)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/[0.035] text-slate-400 hover:bg-slate-900/[0.06] transition-colors disabled:opacity-50"
        >
          Bullet
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this entry?")) start(() => deleteEntry(id));
          }}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/[0.035] text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          ✕
        </button>
      </div>

      {editing && (
        <div className="flex items-start gap-2 w-full sm:w-[420px]">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder="CV-ready one-liner for this…"
            className="flex-1 rounded-lg bg-slate-900/[0.035] border border-slate-900/[0.10] px-3 py-2 text-slate-200 text-xs outline-none focus:border-orange-500/50 resize-none"
          />
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                await saveResumeBullet(id, draft);
                setEditing(false);
              })
            }
            className="px-3 py-2 rounded-lg text-xs font-bold bg-orange-500/15 text-orange-400 border border-orange-400/30 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
