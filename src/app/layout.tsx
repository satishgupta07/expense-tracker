/**
 * Root Layout (layout.tsx)
 *
 * Top-level wrapper for the entire app — like App.tsx in React.
 * Every page renders inside {children}.
 *
 * Key concepts:
 * - `metadata` sets <title> and <meta description> app-wide (for SEO)
 * - Navbar is placed here so it appears on ALL pages automatically
 * - Individual pages can export their own `metadata` to override the title
 */

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// next/font loads and optimizes the font automatically — no external CSS needed
const geist = Geist({
  subsets: ["latin"],
});

// Global metadata — individual pages can override title
export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your income and expenses easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // children = the currently active page
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-slate-50 text-slate-900">

        {/* Navbar renders on every page */}
        <Navbar />

        {/* Page content — constrained width, centered */}
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>

      </body>
    </html>
  );
}
