/**
 * History Page — "/history"
 *
 * Server Component. Step 8 wired this to Prisma; Step 8b adds:
 *   - A filter bar (type, category, date range) driven by URL search params
 *   - A per-row Delete button (Client Component) that calls DELETE
 *     /api/expenses/[id] and refreshes the page
 *
 * Search params come in as `searchParams` (a Promise in Next 16 — you must
 * `await` it). The page passes the parsed filters to `listTransactions` so
 * filtering happens in SQL, not in Node.
 */

import { redirect } from 'next/navigation'

import HistoryFilters from '@/components/HistoryFilters'
import TransactionList from '@/components/TransactionList'
import { auth } from '@/auth'
import { listTransactions } from '@/lib/transactions'
import type { TransactionFilters } from '@/lib/transactions'

export const metadata = {
  title: 'History | Expense Tracker',
}

export const dynamic = 'force-dynamic'

// URLSearchParams allows multiple values per key; we only care about the
// first (the form submits one of each). Returning `undefined` for missing
// or empty params keeps the filter object tidy.
function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0] || undefined
  return value || undefined
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in?callbackUrl=/history')

  const params = await searchParams
  const typeParam = pickFirst(params.type)
  const filters: TransactionFilters = {
    type: typeParam === 'income' || typeParam === 'expense' ? typeParam : undefined,
    category: pickFirst(params.category),
    from: pickFirst(params.from),
    to: pickFirst(params.to),
  }

  const transactions = await listTransactions(session.user.id, filters)
  const isFiltered = Boolean(filters.type || filters.category || filters.from || filters.to)

  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">History</h1>
        <p className="mt-1 text-slate-500">
          {transactions.length === 0
            ? isFiltered
              ? 'No transactions match these filters'
              : 'All your past transactions'
            : `${transactions.length} transaction${transactions.length === 1 ? '' : 's'}${isFiltered ? ' (filtered)' : ' on record'}`}
        </p>
      </div>

      <HistoryFilters current={filters} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <TransactionList
          transactions={transactions}
          showDelete
          emptyMessage={{
            icon: isFiltered ? '🔍' : '📂',
            title: isFiltered ? 'No matches' : 'No transactions yet',
            subtitle: isFiltered
              ? 'Try clearing or adjusting the filters above'
              : 'Transactions will appear here once you add them',
          }}
        />
      </div>

    </div>
  )
}
