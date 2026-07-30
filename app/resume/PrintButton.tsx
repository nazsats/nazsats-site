"use client";

/**
 * Saves the page itself as a PDF via the browser's print dialog.
 *
 * Deliberately not a link to a static file: a checked-in PDF goes stale the
 * moment the page changes, and a missing one silently "downloads" the 404
 * page instead of erroring. The print stylesheet in globals.css strips the
 * nav, footer and buttons so the output is a clean document.
 */
export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-primary">
      Save as PDF ↓
    </button>
  );
}
