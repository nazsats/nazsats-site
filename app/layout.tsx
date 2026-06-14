import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nazsats.com"),
  title: {
    default: "Nazsats — AI & Blockchain Innovation",
    template: "%s — Nazsats",
  },
  description:
    "Nazsats delivers cutting-edge AI, machine learning, data science, and blockchain solutions. Build smarter with us.",
  keywords: ["Nazsats", "AI", "blockchain", "machine learning", "data science", "dApp", "crypto"],
  authors: [{ name: "Nazsats" }],
  creator: "Nazsats",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: "https://nazsats.com",
    siteName: "Nazsats",
    title: "Nazsats — AI & Blockchain Innovation",
    description: "Cutting-edge AI and blockchain solutions for the future.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nazsats — AI & Blockchain Innovation",
    description: "Cutting-edge AI and blockchain solutions for the future.",
  },
  icons: { icon: "/favicon.ico" },
};

// Structured data — tells Google this brand is "Nazsats" and links its profiles.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://nazsats.com/#org",
      name: "Nazsats",
      url: "https://nazsats.com",
      description:
        "AI, machine learning, data science, and blockchain solutions.",
      sameAs: ["https://github.com/nazsats"],
    },
    {
      "@type": "WebSite",
      "@id": "https://nazsats.com/#website",
      url: "https://nazsats.com",
      name: "Nazsats",
      publisher: { "@id": "https://nazsats.com/#org" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-900 text-slate-300 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}