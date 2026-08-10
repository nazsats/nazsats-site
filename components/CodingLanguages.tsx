"use client";

import { useMemo, useState } from "react";
import type { CodingSlice } from "../lib/coding-shared";
import { formatHours } from "../lib/coding-shared";
import { slot, OTHER, AXIS_TEXT, CHART_SURFACE } from "../lib/chart-palette";

/** Six categorical slots exist; the tail folds in rather than growing the palette. */
const MAX_SLOTS = 6;

type Props = {
  slices: CodingSlice[];
  pending?: boolean;
};

export default function CodingLanguages({ slices, pending = false }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  const { rows, total } = useMemo(() => {
    const sorted = [...slices].sort((a, b) => b.seconds - a.seconds);
    const head = sorted.slice(0, MAX_SLOTS);
    const tail = sorted.slice(MAX_SLOTS);

    // WakaTime already emits its own "Other" bucket; merge rather than ending
    // up with two segments of the same name and different colours.
    const existingOther = head.findIndex((s) => s.name.toLowerCase() === "other");
    const tailSeconds = tail.reduce((sum, s) => sum + s.seconds, 0);

    const merged = head.map((s, i) =>
      i === existingOther ? { ...s, seconds: s.seconds + tailSeconds } : s
    );
    if (existingOther === -1 && tailSeconds > 0) {
      merged.push({ name: "Other", seconds: tailSeconds });
    }

    const withColor = merged
      .filter((s) => s.seconds > 0)
      .map((s, i) => ({
        ...s,
        // Colour follows the entity: "Other" always wears the fold colour, so
        // it never impersonates a real language slot.
        color: s.name.toLowerCase() === "other" ? OTHER : slot(i),
      }))
      .sort((a, b) => b.seconds - a.seconds);

    return {
      rows: withColor,
      total: withColor.reduce((sum, s) => sum + s.seconds, 0),
    };
  }, [slices]);

  if (!rows.length) {
    return (
      <p className="text-slate-600 text-xs">
        No language breakdown yet — it fills in as the nightly sync runs.
      </p>
    );
  }

  return (
    <div className="transition-opacity duration-300" style={{ opacity: pending ? 0.45 : 1 }}>
      {/* Share of the window, as one bar. 2px of surface separates segments. */}
      <div className="flex w-full rounded-md overflow-hidden" style={{ height: 10, gap: 2 }}>
        {rows.map((row) => (
          <div
            key={row.name}
            style={{
              width: `${(row.seconds / total) * 100}%`,
              background: row.color,
              opacity: hover && hover !== row.name ? 0.35 : 1,
              transition: "opacity 0.2s ease",
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Legend doubles as the value table — every number is readable without hover */}
      <ul className="mt-4 space-y-2">
        {rows.map((row) => {
          const pct = Math.round((row.seconds / total) * 100);
          return (
            <li
              key={row.name}
              className="flex items-center gap-2.5 rounded px-1 -mx-1 py-0.5 transition-colors"
              style={{ background: hover === row.name ? "rgba(255,255,255,0.04)" : "transparent" }}
              onMouseEnter={() => setHover(row.name)}
              onMouseLeave={() => setHover(null)}
            >
              <span
                className="rounded-sm shrink-0"
                style={{
                  width: 8,
                  height: 8,
                  background: row.color,
                  boxShadow: `0 0 0 2px ${CHART_SURFACE}`,
                }}
              />
              <span className="text-slate-300 text-xs truncate">{row.name}</span>
              <span
                className="ml-auto text-xs tabular-nums shrink-0"
                style={{ color: AXIS_TEXT }}
              >
                {formatHours(row.seconds)}
              </span>
              <span
                className="text-xs tabular-nums shrink-0 text-right"
                style={{ color: AXIS_TEXT, width: 34 }}
              >
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
