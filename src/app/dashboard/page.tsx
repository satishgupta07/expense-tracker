/**
 * Dashboard Page — "/dashboard"
 *
 * Server Component — renders on the server, no 'use client' needed.
 *
 * Currently shows placeholder data.
 * In Step 8 we'll replace the hardcoded values with real data
 * fetched from the database using Prisma.
 *
 * Layout:
 *   - 3 summary cards (Balance, Income, Expenses)
 *   - Recent transactions list (coming later)
 *   - Pie chart (coming later)
 */

export const metadata = {
  title: "Dashboard | Expense Tracker",
};

export default function DashboardPage() {
  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Here&apos;s your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Total Balance */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total Balance</p>
            <span className="text-2xl">💳</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">$0.00</p>
          <p className="mt-2 text-xs text-slate-400">Updated just now</p>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total Income</p>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600">$0.00</p>
          <p className="mt-2 text-xs text-slate-400">This month</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
            <span className="text-2xl">📉</span>
          </div>
          <p className="text-3xl font-bold text-rose-500">$0.00</p>
          <p className="mt-2 text-xs text-slate-400">This month</p>
        </div>

      </div>

      {/* Recent Transactions placeholder */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h2>
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs mt-1">Add your first expense to get started</p>
        </div>
      </div>

    </div>
  );
}
