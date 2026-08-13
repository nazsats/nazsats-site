"use client";

import { useMemo, useState } from "react";
import type { CodingDay } from "../lib/coding-shared";
import { formatHours, formatDayLabel } from "../lib/coding-shared";
import {
  SERIES_EDITOR, SERIES_MANUAL, GRID, AXIS_TEXT, CHART_SURFACE,
  TOOLTIP_BG, TOOLTIP_BORDER, TOOLTIP_SHADOW,
} from "../lib/chart-palette";

const PLOT_HEIGHT = 168;
/** Below this a segment is thinner than its own separator — draw it flush. */
const MIN_SEGMENT = 3;

type Props = {
  days: CodingDay[];
  /** Dimmed while a new range is being fetched, so there is no skeleton flash. */
  pending?: boolean;
};

/** Round the top of the scale up to a clean hour so the ticks read as numbers. */
function niceCeiling(maxSeconds: number): number {
  const hours = Math.max(1, Math.ceil(maxSeconds / 3600));
  if (hours <= 4) return hours * 3600;
  if (hours <= 8) return Math.ceil(hours / 2) * 2 * 3600;
  return Math.ceil(hours / 4) * 4 * 3600;
}

export default function CodingBars({ days, pending = false }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const max = useMemo(
    () => niceCeiling(Math.max(0, ...days.map((d) => d.seconds))),
    [days]
  );

  // Four gridlines including the baseline; ticks carry the values that aren't
  // directly labelled.
  const ticks = useMemo(() => [0, 0.25, 0.5, 0.75, 1].map((f) => f * max), [max]);

  // Label the first day of each month only — one tick per bar would be a wall.
  const monthTicks = useMemo(() => {
    const out: { index: number; label: string }[] = [];
    let lastMonth = "";
    days.forEach((day, i) => {
      const month = day.date.slice(0, 7);
      if (month !== lastMonth) {
        lastMonth = month;
        const [y, m] = month.split("-").map(Number);
        out.push({
          index: i,
          label: new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
            timeZone: "UTC",
            month: "short",
          }),
        });
      }
    });
    return out;
  }, [days]);

  const active = hover === null ? null : days[hover];

  return (
    <div
      className="transition-opacity duration-300"
      style={{ opacity: pending ? 0.45 : 1 }}
    >
      <div className="flex gap-2">
        {/* Y axis */}
        <div
          className="relative shrink-0"
          style={{ height: PLOT_HEIGHT, width: 34 }}
          aria-hidden="true"
        >
          {ticks.map((value, i) => (
            <span
              key={i}
              className="absolute right-0 -translate-y-1/2 tabular-nums"
              style={{
                bottom: `${(value / max) * 100}%`,
                fontSize: 9,
                color: AXIS_TEXT,
              }}
            >
              {value === 0 ? "0" : `${Math.round(value / 3600)}h`}
            </span>
          ))}
        </div>

        {/* Plot */}
        <div className="relative flex-1 min-w-0">
          <div className="relative" style={{ height: PLOT_HEIGHT }}>
            {/* Hairline grid, solid and recessive */}
            {ticks.map((value, i) => (
              <div
                key={i}
                className="absolute left-0 right-0"
                style={{ bottom: `${(value / max) * 100}%`, height: 1, background: GRID }}
                aria-hidden="true"
              />
            ))}

            {/* Bars — 2px of surface between neighbours does the separating */}
            <div className="absolute inset-0 flex items-end" style={{ gap: 2 }}>
              {days.map((day, i) => {
                const editorPct = (day.editorSeconds / max) * 100;
                const manualPct = (day.manualSeconds / max) * 100;
                const hasBoth = day.editorSeconds > 0 && day.manualSeconds > 0;
                const manualTall = (manualPct / 100) * PLOT_HEIGHT >= MIN_SEGMENT;

                return (
                  <button
                    key={day.date}
                    type="button"
                    // The column is the hit target, not the drawn bar — an empty
                    // day still has to be hoverable to report its zero.
                    className="relative flex-1 min-w-0 h-full flex flex-col justify-end outline-none group"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover((h) => (h === i ? null : h))}
                    aria-label={`${formatDayLabel(day.date)}: ${formatHours(day.seconds)} coding`}
                  >
                    {/* Focus/hover wash across the whole column */}
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                      style={{ background: "rgba(22,24,29,0.05)" }}
                      aria-hidden="true"
                    />

                    {day.manualSeconds > 0 && (
                      <span
                        className="relative block w-full"
                        style={{
                          height: `${manualPct}%`,
                          minHeight: 2,
                          background: SERIES_MANUAL,
                          borderRadius: "4px 4px 0 0",
                          // The 2px gap only exists once there is room for it.
                          marginBottom: hasBoth && manualTall ? 2 : 0,
                        }}
                        aria-hidden="true"
                      />
                    )}

                    {day.editorSeconds > 0 && (
                      <span
                        className="relative block w-full"
                        style={{
                          height: `${editorPct}%`,
                          minHeight: 2,
                          background: SERIES_EDITOR,
                          // Rounded only where the stack ends; square at the baseline.
                          borderRadius: day.manualSeconds > 0 ? 0 : "4px 4px 0 0",
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* X axis */}
          <div className="relative mt-2" style={{ height: 14 }} aria-hidden="true">
            {monthTicks.map((tick) => (
              <span
                key={tick.index}
                className="absolute top-0 whitespace-nowrap"
                style={{
                  left: `${(tick.index / Math.max(1, days.length)) * 100}%`,
                  fontSize: 9,
                  color: AXIS_TEXT,
                }}
              >
                {tick.label}
              </span>
            ))}
          </div>

          {/* Tooltip — an enhancement; every value is also in the table view */}
          {active && (
            <div
              role="status"
              className="absolute z-20 pointer-events-none px-3 py-2 rounded-lg"
              style={{
                background: TOOLTIP_BG,
                border: `1px solid ${TOOLTIP_BORDER}`,
                boxShadow: TOOLTIP_SHADOW,
                bottom: PLOT_HEIGHT + 8,
                left: `${(hover! / Math.max(1, days.length)) * 100}%`,
                transform:
                  hover! > days.length * 0.7 ? "translateX(-100%)" : "translateX(0)",
                minWidth: 150,
              }}
            >
              <div className="text-slate-200 text-xs font-semibold whitespace-nowrap">
                {formatDayLabel(active.date)}
              </div>
              <div className="text-slate-200 text-sm font-bold mt-0.5">
                {formatHours(active.seconds)}
              </div>
              {active.seconds > 0 && (
                <div className="mt-1.5 space-y-0.5">
                  {active.editorSeconds > 0 && (
                    <TooltipRow
                      color={SERIES_EDITOR}
                      label="Editor"
                      value={formatHours(active.editorSeconds)}
                    />
                  )}
                  {active.manualSeconds > 0 && (
                    <TooltipRow
                      color={SERIES_MANUAL}
                      label="Tracked"
                      value={formatHours(active.manualSeconds)}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend — two series, so identity is never carried by colour alone */}
      <div className="flex items-center gap-4 mt-3 ml-[42px]">
        <LegendKey color={SERIES_EDITOR} label="Editor time" />
        <LegendKey color={SERIES_MANUAL} label="Tracked manually" />
      </div>
    </div>
  );
}

function TooltipRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span
        className="rounded-sm shrink-0"
        style={{ width: 8, height: 8, background: color, boxShadow: `0 0 0 2px ${CHART_SURFACE}` }}
      />
      <span className="text-slate-400" style={{ fontSize: 10 }}>
        {label}
      </span>
      <span className="text-slate-300 ml-auto tabular-nums" style={{ fontSize: 10 }}>
        {value}
      </span>
    </div>
  );
}

function LegendKey({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="rounded-sm" style={{ width: 8, height: 8, background: color }} />
      <span style={{ fontSize: 10, color: AXIS_TEXT }}>{label}</span>
    </span>
  );
}
