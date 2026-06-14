/**
 * History Page — "/history"
 *
 * Server Component — fetches the full transaction list from Prisma on every
 * request and renders it server-side. Step 8 covers the read-only view;
 * Step 8b adds the filter bar and delete button on top.
 *
 * `force-dynamic` ensures the page re-fetches on every visit; without it,
 * Next 16 might prerender the page at build time and show stale data.
 */

import TransactionList from '@/components/TransactionList'
import { listTransactions } from '@/lib/transactions'

export const metadata = {
  title: 'History | Expense Tracker',
}

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const transactions = await listTransactions()

  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">History</h1>
        <p className="mt-1 text-slate-500">
          {transactions.length === 0
            ? 'All your past transactions'
            : `${transactions.length} transaction${transactions.length === 1 ? '' : 's'} on record`}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <TransactionList
          transactions={transactions}
          emptyMessage={{
            icon: '📂',
            title: 'No transactions yet',
            subtitle: 'Transactions will appear here once you add them',
          }}
        />
      </div>

    </div>
  )
}
