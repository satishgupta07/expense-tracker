/**
 * Route protection (Next 16 `proxy` — the renamed `middleware`).
 *
 * Runs on the Edge runtime, so we can't import the full `src/auth.ts` (it
 * pulls in Prisma, which is Node-only). Instead we instantiate Auth.js with
 * the edge-safe config, which exposes just enough to verify the JWT cookie
 * and surface the session on `req.auth`.
 *
 * Behaviour:
 *   - anonymous user hits a private page → redirect to /sign-in?callbackUrl=…
 *   - signed-in user hits /sign-in or /sign-up → redirect to /dashboard
 *
 * `/api/*` is excluded from the matcher: each Route Handler enforces auth()
 * inline and returns a JSON 401 (instead of an HTML redirect, which fetch
 * consumers would mishandle).
 */

import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

import authConfig from '@/auth.config'

const { auth } = NextAuth(authConfig)

const PUBLIC_PATHS = ['/sign-in', '/sign-up']

export default auth(req => {
  const { pathname } = req.nextUrl
  const isAuthed = Boolean(req.auth?.user)
  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))

  if (!isAuthed && !isPublic) {
    const url = new URL('/sign-in', req.nextUrl)
    url.searchParams.set('callbackUrl', pathname + req.nextUrl.search)
    return NextResponse.redirect(url)
  }

  if (isAuthed && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
