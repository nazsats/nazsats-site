"use client";

import { useState } from "react";

interface Day { contributionCount: number; date: string; }
interface Week { contributionDays: Day[]; }
interface Props { weeks: Week[]; total: number; }

function cellColor(count: number): string {
  if (count === 0) return "rgba(255,255,255,0.04)";
  if (count <= 2)  return "rgba(230,80,0,0.30)";
  if (count <= 5)  return "rgba(230,80,0,0.55)";
  if (count <= 9)  return "rgba(230,80,0,0.80)";
  return "rgba(230,80,0,1)";
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["","Mon","","Wed","","Fri",""];

export default function GitHubHeatmap({ weeks, total }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  if (!weeks.length) return null;

  // Build month labels from first day of each month's week
  const monthLabels: { label: string; col: number }[] = [];
  weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const d = new Date(firstDay.date);
      if (d.getDate() <= 7) {
        monthLabels.push({ label: MONTHS[d.getMonth()], col: wi });
      }
    }
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max">
        {/* Month labels */}
        <div className="flex gap-1 mb-1 ml-8">
          {weeks.map((_, wi) => {
            const ml = monthLabels.find((m) => m.col === wi);
            return (
              <div key={wi} className="w-3 text-center" style={{ fontSize: "9px", color: "#6a5878" }}>
                {ml?.label || ""}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            {DAYS.map((d, i) => (
              <div key={i} className="h-3 flex items-center" style={{ fontSize: "9px", color: "#6a5878", width: 24 }}>
                {d}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.contributionDays.map((day, di) => (
                <div
                  key={di}
                  className="w-3 h-3 rounded-sm cursor-pointer transition-transform duration-150 hover:scale-125"
                  style={{ background: cellColor(day.contributionCount) }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parent = e.currentTarget.closest(".heatmap-root")?.getBoundingClientRect();
                    setTooltip({
                      text: `${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""} on ${day.date}`,
                      x: rect.left - (parent?.left || 0) + 6,
                      y: rect.top - (parent?.top || 0) - 28,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 ml-8">
          <span style={{ fontSize: "10px", color: "#6a5878" }}>Less</span>
          {[0, 2, 5, 9, 12].map((n) => (
            <div key={n} className="w-3 h-3 rounded-sm" style={{ background: cellColor(n) }} />
          ))}
          <span style={{ fontSize: "10px", color: "#6a5878" }}>More</span>
          {total > 0 && (
            <span className="ml-4" style={{ fontSize: "10px", color: "#6a5878" }}>
              {total.toLocaleString()} contributions this year
            </span>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-2 py-1 rounded text-xs text-white"
          style={{
            background: "rgba(10,0,16,0.95)",
            border: "1px solid rgba(230,80,0,0.3)",
            left: tooltip.x,
            top: tooltip.y,
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}