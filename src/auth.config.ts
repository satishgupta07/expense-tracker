/**
 * Edge-safe portion of the Auth.js config.
 *
 * `src/proxy.ts` runs on the Edge runtime, which can't load Node modules
 * (`node:fs`, `node:path`, …). Importing the full `src/auth.ts` into proxy
 * would pull in the Prisma client and crash. So we split the config: the
 * shared callbacks + page paths live here, and the Credentials provider
 * (which uses Prisma + bcrypt) is added back inside `src/auth.ts`.
 *
 * The proxy still needs to verify JWTs (which is pure-JS / edge-safe). With
 * `session.strategy = 'jwt'`, no DB call is required on each request.
 */

import type { NextAuthConfig } from 'next-auth'

const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/sign-in',
  },
  // No providers here — added in src/auth.ts. The proxy never calls
  // authorize(); it only reads the cookie/JWT.
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

export default authConfig
