/**
 * Dashboard Page — "/dashboard"
 *
 * Server Component — runs on the server, fetches directly from the database
 * via Prisma, and ships only the resulting HTML to the browser. No
 * `useEffect`, no client-side fetch, no loading spinner.
 *
 * Step 8 wired the summary cards and the Recent Transactions section to real
 * data. The all-time totals come from a single grouped SQL query; the recent
 * list is the 5 newest transactions.
 *
 * `force-dynamic` opts out of static prerendering so each request reads fresh
 * numbers — the Prisma call already does this implicitly in Next 16, but
 * being explicit makes the intent clear.
 */

import TransactionList from '@/components/TransactionList'
import { getDashboardStats } from '@/lib/transactions'

export const metadata = {
  title: 'Dashboard | Expense Tracker',
}

export const dynamic = 'force-dynamic'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default async function DashboardPage() {
  const { income, expenses, balance, recent } = await getDashboardStats()

  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Here&apos;s your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total Balance</p>
            <span className="text-2xl">💳</span>
          </div>
          <p
            className={`text-3xl font-bold tabular-nums ${
              balance < 0 ? 'text-rose-500' : 'text-slate-900'
            }`}
          >
            {currency.format(balance)}
          </p>
          <p className="mt-2 text-xs text-slate-400">All time</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total Income</p>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600 tabular-nums">
            {currency.format(income)}
          </p>
          <p className="mt-2 text-xs text-slate-400">All time</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
            <span className="text-2xl">📉</span>
          </div>
          <p className="text-3xl font-bold text-rose-500 tabular-nums">
            {currency.format(expenses)}
          </p>
          <p className="mt-2 text-xs text-slate-400">All time</p>
        </div>

      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h2>
        <TransactionList
          transactions={recent}
          emptyMessage={{
            icon: '📭',
            title: 'No transactions yet',
            subtitle: 'Add your first expense to get started',
          }}
        />
      </div>

    </div>
  )
}
