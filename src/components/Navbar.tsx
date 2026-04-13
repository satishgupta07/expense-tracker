/**
 * Navbar Component
 *
 * Shared navigation bar rendered on every page via layout.tsx.
 * Uses a deep dark background (slate-900) for a professional finance app feel.
 *
 * NOTE: This is a Server Component (no 'use client').
 * We use Next.js <Link> instead of <a> for client-side navigation (no page reload).
 */

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white hover:text-violet-400 transition-colors"
        >
          <span className="text-2xl">💰</span>
          <span>Expense Tracker</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 font-medium transition-all"
          >
            Dashboard
          </Link>
          <Link
            href="/history"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 font-medium transition-all"
          >
            History
          </Link>

          {/* Add Expense stands out as a CTA button */}
          <Link
            href="/add-expense"
            className="ml-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all"
          >
            + Add Expense
          </Link>
        </div>

      </div>
    </nav>
  );
}
