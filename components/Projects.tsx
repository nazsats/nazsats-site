import { projects } from "../lib/site";
import Tilt from "./Tilt";

const categoryColor: Record<string, string> = {
  Web3: "text-cyan-400 border-cyan-400/25 bg-cyan-400/5",
  AI: "text-purple-400 border-purple-400/25 bg-purple-400/5",
  "Web App": "text-green-400 border-green-400/20 bg-green-400/5",
};

export default function Projects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((p) => (
        <Tilt key={p.name} max={8}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card flex flex-col h-full group no-underline !p-0 overflow-hidden"
          >
            {/* Live screenshot */}
            <div className="relative aspect-[16/10] overflow-hidden border-b border-white/5 bg-dark-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://image.thum.io/get/width/800/crop/500/noanimate/${p.url}`}
                alt={`${p.name} screenshot`}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col flex-1 p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  categoryColor[p.category] ?? "text-slate-400 border-white/10"
                }`}
              >
                {p.category}
              </span>
              <svg
                className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>

            <h3 className="text-white font-black text-lg leading-tight group-hover:text-purple-400 transition-colors">
              {p.name}
            </h3>
            <p className="text-orange-400/80 text-xs font-semibold mb-3">{p.tagline}</p>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">{p.description}</p>

            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs text-slate-500 border border-white/5 bg-white/3 px-2 py-0.5 rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>

            <span className="text-sm font-semibold gradient-text mt-4">Visit live site →</span>
            </div>
          </a>
        </Tilt>
      ))}
    </div>
  );
}
