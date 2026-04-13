/**
 * History Page — "/history"
 *
 * Server Component — will use SSR to fetch fresh data on every request.
 *
 * In Step 8 we'll replace the placeholder with:
 *   - Full list of all transactions from the database
 *   - Filter bar (by type, category, date)
 *   - Delete transaction button
 */

export const metadata = {
  title: "History | Expense Tracker",
};

export default function HistoryPage() {
  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">History</h1>
        <p className="mt-1 text-slate-500">All your past transactions</p>
      </div>

      {/* Filter Bar Placeholder */}
      <div className="flex gap-3 mb-6">
        <div className="h-10 w-32 bg-white border border-slate-200 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-white border border-slate-200 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-white border border-slate-200 rounded-lg animate-pulse" />
      </div>

      {/* Transactions List Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <span className="text-4xl mb-3">📂</span>
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs mt-1">Transactions will appear here once you add them</p>
        </div>
      </div>

    </div>
  );
}
