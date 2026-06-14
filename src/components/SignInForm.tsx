'use client'

/**
 * SignInForm — calls Auth.js' `signIn('credentials', ...)` from the browser.
 *
 * `redirect: false` keeps the user on this page if sign-in fails so we can
 * show an inline error; on success we route to `callbackUrl` ourselves.
 */

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  callbackUrl: string
}

export default function SignInForm({ callbackUrl }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const res = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    })

    setBusy(false)
    if (res?.error) {
      setError('Invalid email or password')
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-5"
    >
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm font-medium">
          {error}
        </div>
      )}

      <label className="flex flex-col text-sm font-medium text-slate-600">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </label>

      <label className="flex flex-col text-sm font-medium text-slate-600">
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </label>

      <button
        type="submit"
        disabled={busy}
        className="mt-2 py-3 rounded-xl font-semibold text-white text-sm bg-violet-600 hover:bg-violet-500 transition disabled:opacity-60"
      >
        {busy ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
