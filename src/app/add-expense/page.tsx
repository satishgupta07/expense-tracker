/**
 * Add Expense Page — "/add-expense"
 *
 * Currently a Server Component placeholder.
 * In Step 5 we'll add a Client Component form here with:
 *   - Amount input
 *   - Category selector
 *   - Type toggle (Income / Expense)
 *   - Date picker
 *   - Description field
 *   - Submit button that calls our API route
 */

export const metadata = {
  title: "Add Expense | Expense Tracker",
};

export default function AddExpensePage() {
  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Add Expense</h1>
        <p className="mt-1 text-slate-500">Record a new income or expense</p>
      </div>

      {/* Form Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-lg">
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <span className="text-4xl mb-3">📝</span>
          <p className="text-sm">Form is coming in Step 5</p>
          <p className="text-xs mt-1">We&apos;ll build this with Client Components</p>
        </div>
      </div>

    </div>
  );
}
