'use client'

/**
 * SignOutButton — small client component that calls Auth.js' `signOut()`.
 *
 * `signOut` clears the session cookie and (with `redirect: true`, the default)
 * routes the browser to the configured `pages.signIn` page. We override the
 * `callbackUrl` to be safe in case the default ever changes.
 */

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/sign-in' })}
      className="text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition"
    >
      Sign out
    </button>
  )
}
