/**
 * Dynamic Route Handler — /api/expenses/[id]
 *
 *   DELETE /api/expenses/:id → remove a transaction owned by the signed-in user
 *
 * In Next 16 `params` is a Promise — the `RouteContext` helper types it.
 * The Step 9 store does the ownership check inside `deleteMany`, returning
 * `false` if no row was deleted; we use that to distinguish "not found" /
 * "not yours" from "actually deleted" without disclosing which is which.
 */

import { auth } from '@/auth'
import { deleteTransaction } from '@/lib/transactions'

export async function DELETE(
  _request: Request,
  ctx: RouteContext<'/api/expenses/[id]'>,
) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params
  const deleted = await deleteTransaction(session.user.id, id)
  if (!deleted) {
    return Response.json({ error: 'Transaction not found' }, { status: 404 })
  }
  return new Response(null, { status: 204 })
}
