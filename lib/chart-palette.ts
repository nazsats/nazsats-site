/**
 * Chart colours for the light site surface (#FFFFFF).
 *
 * These are not hand-picked. Re-validated with the dataviz palette checker
 * after the site moved from a dark theme to a light one:
 *
 *   lightness band  PASS  all 6 inside OKLCH L 0.43–0.77
 *   chroma floor    PASS  all 6 >= 0.10
 *   CVD separation  PASS  worst adjacent pair ΔE 10.9 (protanopia)
 *   normal vision   PASS  worst adjacent pair ΔE 17.1
 *   contrast        PASS  all 6 >= 3:1 vs white
 *
 * The categorical slots survived the surface change unchanged. The single
 * brand orange did not: #FF7A00 measures 2.61:1 on white, below the 3:1 mark
 * for marks, so the bar series uses the darker #E06A00 instead.
 *
 * The ORDER is the colourblind-safety mechanism — slots are assigned in
 * sequence and never re-ordered or cycled. A 7th hue would break the
 * adjacency guarantee, so the tail folds into OTHER.
 */

export const CHART_SURFACE = "#FFFFFF";

/** Categorical slots, in fixed assignment order. */
export const CATEGORICAL = [
  "#E06A00", // orange
  "#2E86E0", // blue
  "#FF2266", // magenta
  "#A566E0", // purple
  "#A88A1E", // olive
  "#16856A", // teal
] as const;

/** Everything past the 6 slots collapses here rather than growing the palette. */
export const OTHER = "#94A3B8";

/** Editor time — the brand orange, stepped down to clear 3:1 on white. */
export const SERIES_EDITOR = "#E06A00";

/** Second series: manual stopwatch time, distinct from editor time. */
export const SERIES_MANUAL = "#2E86E0";

/** Recessive chrome: one step off the surface, never competing with the data. */
export const GRID = "rgba(15, 23, 42, 0.10)";
export const AXIS_TEXT = "#64748B";

/** Tooltip surface — a raised white card, not an inverted dark one. */
export const TOOLTIP_BG = "#FFFFFF";
export const TOOLTIP_BORDER = "rgba(15, 23, 42, 0.12)";
export const TOOLTIP_SHADOW = "0 8px 24px rgba(15, 23, 42, 0.14)";

/** Assign a slot by index, folding the tail into OTHER. */
export function slot(index: number): string {
  return index < CATEGORICAL.length ? CATEGORICAL[index] : OTHER;
}
