'use client'

/**
 * SignUpForm — POSTs to /api/auth/signup, then signs the user in.
 *
 * After a successful sign-up we immediately call Auth.js' `signIn('credentials')`
 * so the user lands on the dashboard already authenticated, with no manual
 * sign-in step.
 */

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpForm() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')
    const name = String(form.get('name') ?? '')

    const signupRes = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    if (!signupRes.ok) {
      const data = await signupRes.json().catch(() => null)
      setError(data?.error ?? `Sign-up failed (${signupRes.status})`)
      setBusy(false)
      return
    }

    const loginRes = await signIn('credentials', { email, password, redirect: false })
    setBusy(false)

    if (loginRes?.error) {
      setError('Account created — please sign in')
      router.push('/sign-in')
      return
    }
    router.push('/dashboard')
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
        Name <span className="text-slate-400 font-normal">(optional)</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          className="mt-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </label>

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
        Password <span className="text-slate-400 font-normal">(min 8 chars)</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </label>

      <button
        type="submit"
        disabled={busy}
        className="mt-2 py-3 rounded-xl font-semibold text-white text-sm bg-violet-600 hover:bg-violet-500 transition disabled:opacity-60"
      >
        {busy ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  )
}
