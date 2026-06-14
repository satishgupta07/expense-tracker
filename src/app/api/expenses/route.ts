/**
 * Route Handler — /api/expenses
 *
 * App Router uses `route.ts` files (NOT pages/api). Each named export
 * (GET, POST, …) maps to that HTTP method.
 *
 *   GET  /api/expenses → list the signed-in user's transactions (newest first)
 *   POST /api/expenses → create a transaction owned by the signed-in user
 *
 * Step 9 change: `auth()` reads the JWT session. No session → 401, so the
 * /api/expenses endpoints are private even though the middleware doesn't
 * sit in front of /api/* (it skips /api/auth/* but lets /api/expenses
 * through, so we enforce auth here in the handler).
 */

import { auth } from '@/auth'
import {
  createTransaction,
  listTransactions,
  validateTransaction,
} from '@/lib/transactions'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json(await listTransactions(session.user.id))
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'Body must be a JSON object' }, { status: 400 })
  }

  const error = validateTransaction(body as Parameters<typeof validateTransaction>[0])
  if (error) {
    return Response.json({ error }, { status: 400 })
  }

  const created = await createTransaction(session.user.id, body as Parameters<typeof createTransaction>[1])
  return Response.json(created, { status: 201 })
}
