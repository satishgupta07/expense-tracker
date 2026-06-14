/**
 * Augment Auth.js types so `session.user.id` is recognised everywhere.
 *
 * Auth.js' default `User` and `Session` shapes don't include `id` because
 * databases vary. We promised in the `session` callback (src/auth.ts) that
 * we'd put the user id there — this file teaches TypeScript about it.
 */

import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    id?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
  }
}
