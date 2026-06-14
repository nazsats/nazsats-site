// Central place for contact info, project showcase, and pricing.
// Edit prices / descriptions here and they update everywhere on the site.

/** WhatsApp number in international format, no "+" or spaces. */
export const WHATSAPP_NUMBER = "971583029084";

/** Pre-filled WhatsApp chat link with a default message. */
export function whatsappLink(
  message = "Hi Nazsats! I'd like to discuss a project."
) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type Project = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  tags: string[];
  category: "Web3" | "AI" | "Web App";
};

export const projects: Project[] = [
  {
    name: "OTTER Protocol",
    tagline: "Gamified Web3 community on Ethereum",
    description:
      "A gated Web3 community platform on Ethereum with cipher-based onboarding, wallet linking, NFT 'sigil' minting, community voting, and referral-driven growth.",
    url: "https://otterfi.vercel.app/",
    tags: ["Ethereum", "NFT", "dApp"],
    category: "Web3",
  },
  {
    name: "BloodAI — Report Analyzer",
    tagline: "AI that reads your blood reports",
    description:
      "A healthtech AI tool that analyzes blood test reports and turns raw lab results into clear, understandable health insights.",
    url: "https://blood-report-analyzer-phi.vercel.app/",
    tags: ["AI", "HealthTech", "Data Science"],
    category: "AI",
  },
  {
    name: "Eventopic",
    tagline: "Event-staffing marketplace for Dubai",
    description:
      "A job platform connecting event professionals — promoters, models, hosts — with live gigs across Dubai, featuring verified profiles and an AI career assistant.",
    url: "https://eventopic.vercel.app/",
    tags: ["Web App", "Marketplace", "AI"],
    category: "Web App",
  },
  {
    name: "Catcents",
    tagline: "Web3 community gaming hub",
    description:
      "A Web3 social-gaming platform with 50,000+ users and 1M+ transactions, blending blockchain games with crypto rewards and community engagement.",
    url: "https://catcentsio.vercel.app/",
    tags: ["Web3", "Gaming", "Crypto"],
    category: "Web3",
  },
  {
    name: "Froggy Folios",
    tagline: "Competitive Web3 mini-games",
    description:
      "An interactive Web3 gaming platform with multiple mini-games, competitive leaderboards, a whitelist checker, and real-time player activity tracking.",
    url: "https://froggyfolios.vercel.app/",
    tags: ["Web3", "Gaming"],
    category: "Web3",
  },
];

export type Package = {
  name: string;
  price: string;
  blurb: string;
  features: string[];
  highlight?: boolean;
};

// NOTE: these are starting prices — adjust to your market any time.
export const packages: Package[] = [
  {
    name: "Launch",
    price: "from $100",
    blurb: "Landing pages & modern portfolio sites that convert.",
    features: [
      "1–3 page responsive site",
      "Modern animated UI",
      "SEO basics + analytics",
      "Contact / lead form",
      "Delivered in ~1 day",
    ],
  },
  {
    name: "Growth",
    price: "from $799",
    blurb: "Full web apps, AI tools & automation for startups.",
    features: [
      "Custom web app or AI tool",
      "Database + admin dashboard",
      "AI / automation features",
      "Auth & integrations",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    blurb: "dApps, smart contracts, complex AI & ongoing builds.",
    features: [
      "Smart contracts & dApps",
      "Advanced AI / data science",
      "Scalable architecture",
      "Ongoing partnership",
      "Tailored scope & quote",
    ],
  },
];
