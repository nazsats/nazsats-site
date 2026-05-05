import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nazsats.com"),
  title: "Nazsats — AI & Blockchain Innovation",
  description: "Nazsats delivers cutting-edge AI, machine learning, data science, and blockchain solutions. Build smarter with us.",
  keywords: ["AI", "blockchain", "machine learning", "data science", "dApp", "crypto"],
  openGraph: {
    title: "Nazsats — AI & Blockchain Innovation",
    description: "Cutting-edge AI and blockchain solutions for the future.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-900 text-slate-300 antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}