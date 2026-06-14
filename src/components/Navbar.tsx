/**
 * Navbar Component
 *
 * Server Component. Step 9 added an authenticated/anonymous split:
 *   - Signed in  → Dashboard / History / + Add Expense / user email + Sign Out
 *   - Signed out → only "Sign in" CTA
 *
 * The `session` prop is fetched in src/app/layout.tsx and passed down so we
 * don't pay for a second `auth()` call on every render.
 */

import Link from 'next/link'
import type { Session } from 'next-auth'

import SignOutButton from './SignOutButton'

export default function Navbar({ session }: { session: Session | null }) {
  const user = session?.user

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand / Logo */}
        <Link
          href={user ? '/dashboard' : '/sign-in'}
          className="flex items-center gap-2 text-xl font-bold text-white hover:text-violet-400 transition-colors"
        >
          <span className="text-2xl">💰</span>
          <span>Expense Tracker</span>
        </Link>

        {user ? (
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

            <div className="ml-4 flex items-center gap-3 border-l border-slate-700 pl-4">
              <span className="text-sm text-slate-300 max-w-[180px] truncate" title={user.email ?? undefined}>
                {user.name || user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all"
          >
            Sign in
          </Link>
        )}

      </div>
    </nav>
  )
}
