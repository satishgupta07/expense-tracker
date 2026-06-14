/**
 * Sign-up Route Handler — POST /api/auth/signup
 *
 * Auth.js handles sign-IN for Credentials, but it deliberately does NOT do
 * user registration — that's app-specific logic. This endpoint creates a
 * new User row with a bcrypt-hashed password, then returns 201.
 *
 * Validation here is intentionally light (email format + min length); a real
 * app would also check password strength, send a verification email, etc.
 */

import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const BCRYPT_ROUNDS = 10

interface SignupInput {
  email?: unknown
  password?: unknown
  name?: unknown
}

export async function POST(request: Request) {
  let body: SignupInput
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''

  if (!EMAIL.test(email)) {
    return Response.json({ error: 'A valid email is required' }, { status: 400 })
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return Response.json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return Response.json({ error: 'An account with that email already exists' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
    },
    select: { id: true, email: true, name: true },
  })

  return Response.json(user, { status: 201 })
}
