"use client";

import { useEffect, useState } from "react";

const phrases = [
  "AI models that predict.",
  "dApps that scale.",
  "Data pipelines that deliver.",
  "Blockchain solutions that last.",
  "The future — shipped.",
];

export default function TypewriterText() {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (charIdx > 0) {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setPhraseIdx((i) => (i + 1) % phrases.length);
        }
      }
    }, deleting ? 40 : 70);

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <span className="gradient-text-animated">
      {displayed}
      <span className="animate-pulse ml-0.5 text-orange-400">|</span>
    </span>
  );
}