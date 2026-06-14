/**
 * HistoryFilters — filter bar for /history.
 *
 * Server Component. Renders a native HTML <form method="get"> that submits
 * to /history with the chosen filters in the URL's search params. No
 * JavaScript needed: pressing "Apply" reloads the page server-side with the
 * new query string, and the History page reads `searchParams` to filter.
 *
 * Initial values come from the current URL (passed in as `current`), so the
 * inputs always reflect the active filter state.
 */

import Link from 'next/link'
import type { TransactionFilters } from '@/lib/transactions'

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Health', 'Entertainment', 'Shopping', 'Other'] as const
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'] as const
const ALL_CATEGORIES = Array.from(new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]))

export default function HistoryFilters({ current }: { current: TransactionFilters }) {
  const hasFilter = Boolean(current.type || current.category || current.from || current.to)

  return (
    <form
      method="get"
      action="/history"
      className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap items-end gap-3"
    >
      <label className="flex flex-col text-xs font-medium text-slate-600">
        Type
        <select
          name="type"
          defaultValue={current.type ?? ''}
          className="mt-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="">All</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>

      <label className="flex flex-col text-xs font-medium text-slate-600">
        Category
        <select
          name="category"
          defaultValue={current.category ?? ''}
          className="mt-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="">All</option>
          {ALL_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-xs font-medium text-slate-600">
        From
        <input
          type="date"
          name="from"
          defaultValue={current.from ?? ''}
          className="mt-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </label>

      <label className="flex flex-col text-xs font-medium text-slate-600">
        To
        <input
          type="date"
          name="to"
          defaultValue={current.to ?? ''}
          className="mt-1 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </label>

      <button
        type="submit"
        className="h-10 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition"
      >
        Apply
      </button>

      {hasFilter && (
        <Link
          href="/history"
          className="h-10 px-4 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center"
        >
          Clear
        </Link>
      )}
    </form>
  )
}
