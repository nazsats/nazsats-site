import type { Metadata } from "next";
import Link from "next/link";
import Projects from "../../components/Projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Nazsats — Web3 dApps, AI tools, and web apps including OTTER Protocol, BloodAI, Eventopic, Catcents, and Froggy Folios.",
  alternates: { canonical: "/work" },
};

export default function Work() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="section-badge mb-6 animate-fade-in">Portfolio</div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-200 mb-6 animate-fade-in-up delay-100 leading-tight">
          Selected <span className="gradient-text-animated">Work</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-200">
          Live products I&apos;ve built — across Web3, AI, and full-stack web apps. Click any card to explore it.
        </p>
      </div>

      <Projects />

      {/* CTA */}
      <div className="glass-card text-center animate-glow-pulse max-w-2xl mx-auto mt-20">
        <h2 className="text-2xl font-black text-slate-200 mb-3">
          Like what you <span className="gradient-text">see?</span>
        </h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Let&apos;s build your project next. Message me directly and we&apos;ll talk through it.
        </p>
        <Link href="/contact" className="btn-primary">
          Book a call →
        </Link>
      </div>
    </div>
  );
}
