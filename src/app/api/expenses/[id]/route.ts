/**
 * Dynamic Route Handler — /api/expenses/[id]
 *
 * In the App Router, dynamic segments are folders wrapped in square brackets.
 * The `[id]` folder produces `params.id` for handlers inside it. In Next 16
 * `params` is a Promise — the `RouteContext` helper types it for you.
 *
 *   DELETE /api/expenses/:id → remove a transaction
 *
 * Returns 204 No Content on success and 404 if the row doesn't exist.
 */

import { deleteTransaction } from '@/lib/transactions'

export async function DELETE(
  _request: Request,
  ctx: RouteContext<'/api/expenses/[id]'>,
) {
  const { id } = await ctx.params

  try {
    await deleteTransaction(id)
    return new Response(null, { status: 204 })
  } catch {
    // Prisma throws P2025 when the record isn't found. Anything else here is
    // unexpected; the helper layer should surface real errors as 500s. For
    // this learning project we collapse to 404 so the UI can show a clear
    // "already deleted" message.
    return Response.json({ error: 'Transaction not found' }, { status: 404 })
  }
}
