/**
 * Chart colours for the dark site surface (#0A0010).
 *
 * These are not hand-picked. The categorical slots below were validated with
 * the dataviz palette checker against this exact surface:
 *
 *   lightness band  PASS  all 6 inside OKLCH L 0.48–0.67
 *   chroma floor    PASS  all 6 >= 0.10
 *   CVD separation  PASS  worst adjacent pair ΔE 10.9 (protanopia)
 *   normal vision   PASS  worst adjacent pair ΔE 17.1
 *   contrast        PASS  all 6 >= 3:1 vs surface
 *
 * The ORDER is the colourblind-safety mechanism — slots are assigned in
 * sequence and never re-ordered or cycled. Adding a 7th hue would break the
 * adjacency guarantee, so the tail folds into OTHER instead.
 */

export const CHART_SURFACE = "#0A0010";

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
export const OTHER = "#5B4A6B";

/** Single-series mark colour — the brand accent, used when identity isn't in play. */
export const SERIES_EDITOR = "#FF7A00";

/** Second series: manual stopwatch time, distinct from editor time. */
export const SERIES_MANUAL = "#2E86E0";

/** Recessive chrome: one step off the surface, never competing with the data. */
export const GRID = "rgba(255,255,255,0.07)";
export const AXIS_TEXT = "#6a5878";

/** Assign a slot by index, folding the tail into OTHER. */
export function slot(index: number): string {
  return index < CATEGORICAL.length ? CATEGORICAL[index] : OTHER;
}
