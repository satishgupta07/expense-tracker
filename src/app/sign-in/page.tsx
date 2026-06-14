/**
 * Sign-in Page — "/sign-in"
 *
 * Server Component shell that hosts the SignInForm Client Component.
 * `searchParams.callbackUrl` is set by middleware when it redirects an
 * anonymous user away from a protected page; we forward it to the form so
 * sign-in returns them to where they were trying to go.
 */

import Link from 'next/link'
import { redirect } from 'next/navigation'

import SignInForm from '@/components/SignInForm'
import { auth } from '@/auth'

export const metadata = {
  title: 'Sign In | Expense Tracker',
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  const params = await searchParams
  const raw = Array.isArray(params.callbackUrl) ? params.callbackUrl[0] : params.callbackUrl
  // Only accept relative callback URLs so an attacker can't redirect users
  // off-site via ?callbackUrl=https://evil.example.com.
  const callbackUrl = typeof raw === 'string' && raw.startsWith('/') ? raw : '/dashboard'

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Sign In</h1>
        <p className="mt-1 text-slate-500">Welcome back</p>
      </div>

      <SignInForm callbackUrl={callbackUrl} />

      <p className="mt-6 text-sm text-slate-500 text-center">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-violet-600 hover:text-violet-500 font-medium">
          Create one
        </Link>
      </p>
    </div>
  )
}
