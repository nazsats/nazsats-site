"use client";

import { useEffect, useRef } from "react";

export default function MouseOrb() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = orbRef.current?.parentElement;
    if (!hero) return;

    const handleMove = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left - 200;
      const y = e.clientY - rect.top - 200;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    hero.addEventListener("mousemove", handleMove as EventListener);
    return () => hero.removeEventListener("mousemove", handleMove as EventListener);
  }, []);

  return (
    <div
      ref={orbRef}
      className="pointer-events-none absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] transition-transform duration-300 ease-out"
      style={{ background: "rgba(255,85,0,0.12)", willChange: "transform" }}
    />
  );
}