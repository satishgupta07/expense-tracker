/**
 * Route Handler — /api/expenses
 *
 * App Router uses `route.ts` files (NOT pages/api). Each named export
 * (GET, POST, …) maps to that HTTP method. Returning Response.json()
 * sends the value as JSON with the right Content-Type.
 *
 *   GET  /api/expenses → list all transactions (newest first)
 *   POST /api/expenses → create a new transaction
 *
 * Step 7 change: the helpers from `@/lib/transactions` are now async because
 * they hit SQLite via Prisma. We `await` them here — nothing else changes.
 * Route Handlers aren't cached by default in Next 16 (GET only opts in via
 * `dynamic = 'force-static'`), so each request reads fresh data.
 */

import {
  createTransaction,
  listTransactions,
  validateTransaction,
} from '@/lib/transactions'

export async function GET() {
  return Response.json(await listTransactions())
}

export async function POST(request: Request) {
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

  const created = await createTransaction(body as Parameters<typeof createTransaction>[0])
  return Response.json(created, { status: 201 })
}
