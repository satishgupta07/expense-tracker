/**
 * Sign-up Page — "/sign-up"
 *
 * Server Component shell that hosts the SignUpForm Client Component. If a
 * signed-in user lands here we just send them back to the dashboard.
 */

import Link from 'next/link'
import { redirect } from 'next/navigation'

import SignUpForm from '@/components/SignUpForm'
import { auth } from '@/auth'

export const metadata = {
  title: 'Sign Up | Expense Tracker',
}

export default async function SignUpPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-1 text-slate-500">Track your income and expenses</p>
      </div>

      <SignUpForm />

      <p className="mt-6 text-sm text-slate-500 text-center">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-violet-600 hover:text-violet-500 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
