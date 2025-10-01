import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nazsats.com"), // Replace with your production URL
  title: "Nazsats - AI & Blockchain Innovation Platform",
  description: "Nazsats empowers clients with AI-driven solutions in machine learning, data science, and blockchain. Launching soon with advanced features.",
  keywords: ["AI", "blockchain", "machine learning", "data science", "crypto"],
  openGraph: {
    title: "Nazsats",
    description: "AI-driven platform for blockchain and data science solutions.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-b from-purple-50 to-white text-gray-900 antialiased`}>
        <Navbar />
        <main className="container mx-auto py-12 px-4">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}