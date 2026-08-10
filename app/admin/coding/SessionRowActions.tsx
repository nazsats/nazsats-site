"use client";

import { useState, useTransition } from "react";
import { removeSession } from "./actions";

/** Delete control for one logged session. Two-step, since deletion is final. */
export default function SessionRowActions({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs text-slate-600 hover:text-red-400 transition-colors"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => removeSession(id))}
        className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
      >
        {pending ? "Deleting…" : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
      >
        Cancel
      </button>
    </span>
  );
}
