/**
 * Chart colours for a monochrome site with one accent.
 *
 * The brand is black, white and their shades, with cyan used sparingly. That
 * rules out a six-hue categorical palette, so the language breakdown uses an
 * ORDINAL cyan ramp instead — legitimate here because those segments are
 * sorted by size, so position in the ramp carries the ordering rather than
 * spending the identity channel on it.
 *
 * Validated with the dataviz checker against the card surface (#FCFCFD):
 *
 *   lightness monotone   PASS  steps read light→dark
 *   adjacent ΔL          PASS  all gaps >= 0.06
 *   light-end contrast   PASS  #0CB4CF at 2.43:1, above the 2:1 floor
 *   single hue           PASS  hue spread 10°
 *
 * The two-series bar chart uses emphasis rather than categorical: the measure
 * that matters is cyan, the other is de-emphasis grey. Both clear 3:1.
 */

export const CHART_SURFACE = "#FCFCFD";

/**
 * Ordinal ramp, light → dark, for share-of-total segments sorted by size.
 * Not a categorical palette: swapping two steps would misstate the order.
 */
export const RAMP = [
  "#0CB4CF",
  "#0A97B0",
  "#0C8096",
  "#0E6A7E",
  "#114F5F",
  "#143B48",
] as const;

/** Everything past the ramp collapses here rather than extending it. */
export const OTHER = "#A9B0BA";

/** Editor time — the measure the section is about, so it carries the accent. */
export const SERIES_EDITOR = "#0891B2";

/** Manually tracked time — present for completeness, so it recedes to grey. */
export const SERIES_MANUAL = "#565C66";

/** Recessive chrome: one step off the surface, never competing with the data. */
export const GRID = "rgba(22, 24, 29, 0.10)";
export const AXIS_TEXT = "#7A828D";

/** Tooltip surface — a raised card, not an inverted dark one. */
export const TOOLTIP_BG = "#FCFCFD";
export const TOOLTIP_BORDER = "rgba(22, 24, 29, 0.12)";
export const TOOLTIP_SHADOW = "0 8px 24px rgba(22, 24, 29, 0.14)";

/** Assign a ramp step by rank, folding the tail into OTHER. */
export function slot(index: number): string {
  return index < RAMP.length ? RAMP[index] : OTHER;
}
