/**
 * Auth.js v5 configuration — Credentials provider only.
 *
 * This file runs in the Node runtime — it can import Prisma + bcrypt freely.
 * Edge-only code (the proxy) imports `auth.config.ts` instead, which omits
 * the providers and any Node-only modules.
 *
 * JWT sessions (not database sessions) — Credentials provider in Auth.js
 * requires JWT. We stuff the user id into the token in the `jwt` callback
 * (shared via `auth.config.ts`) and read it back into `session.user.id` in
 * the `session` callback. Pages/API can then call `auth()` and trust
 * `session.user.id`.
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

import authConfig from './auth.config'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Email + Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(rawCredentials) {
        const email = typeof rawCredentials?.email === 'string' ? rawCredentials.email.trim().toLowerCase() : ''
        const password = typeof rawCredentials?.password === 'string' ? rawCredentials.password : ''
        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null

        // Return only what should be on the session — never the password hash.
        return { id: user.id, email: user.email, name: user.name ?? undefined }
      },
    }),
  ],
})
