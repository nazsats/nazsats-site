"use client";

const stack = [
  { name: "Python",      color: "#3776AB", text: "#fff", symbol: "🐍" },
  { name: "TypeScript",  color: "#3178C6", text: "#fff", symbol: "TS" },
  { name: "React",       color: "#20232a", text: "#61DAFB", symbol: "⚛" },
  { name: "Next.js",     color: "#000",    text: "#fff", symbol: "▲" },
  { name: "TensorFlow",  color: "#FF6F00", text: "#fff", symbol: "🧠" },
  { name: "PyTorch",     color: "#EE4C2C", text: "#fff", symbol: "🔥" },
  { name: "Solidity",    color: "#1c1c3a", text: "#a0a0ff", symbol: "◆" },
  { name: "Ethereum",    color: "#627EEA", text: "#fff", symbol: "⟠" },
  { name: "Solana",      color: "#9945FF", text: "#fff", symbol: "◎" },
  { name: "Node.js",     color: "#339933", text: "#fff", symbol: "⬡" },
  { name: "Docker",      color: "#2496ED", text: "#fff", symbol: "🐳" },
  { name: "Web3.js",     color: "#F16822", text: "#fff", symbol: "🌐" },
  { name: "Scikit-learn",color: "#F7931E", text: "#fff", symbol: "🔬" },
  { name: "PostgreSQL",  color: "#336791", text: "#fff", symbol: "🐘" },
  { name: "Git",         color: "#F05032", text: "#fff", symbol: "⎇" },
  { name: "Linux",       color: "#FCC624", text: "#000", symbol: "🐧" },
];

export default function TechStack() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {stack.map((tech, i) => (
        <div
          key={tech.name}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 transition-all duration-300 cursor-default"
          style={{
            background: "rgba(255,255,255,0.03)",
            animationDelay: `${i * 0.05}s`,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = tech.color;
            el.style.borderColor = "transparent";
            el.style.transform = "translateY(-4px) scale(1.05)";
            el.style.boxShadow = `0 8px 24px ${tech.color}55`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "rgba(255,255,255,0.03)";
            el.style.borderColor = "rgba(255,255,255,0.05)";
            el.style.transform = "";
            el.style.boxShadow = "";
          }}
        >
          <span className="text-lg leading-none">{tech.symbol}</span>
          <span className="text-sm font-semibold text-slate-400 group-hover:text-white transition-colors whitespace-nowrap">
            {tech.name}
          </span>
        </div>
      ))}
    </div>
  );
}