/**
 * TransactionList — shared list rendering for /dashboard and /history.
 *
 * Server Component (no 'use client'). It receives an array of Transactions
 * fetched in the page (a Server Component above it) and renders rows.
 * Splitting it out keeps each page focused on layout + data fetching.
 *
 * Empty state is opt-in via `emptyMessage` so each page can speak in its
 * own voice ("Add your first expense…" on the dashboard vs. "No history
 * yet" on the history page).
 */

import type { Transaction } from '@/lib/transactions'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

interface Props {
  transactions: Transaction[]
  emptyMessage?: { title: string; subtitle?: string; icon?: string }
}

export default function TransactionList({ transactions, emptyMessage }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <span className="text-4xl mb-3">{emptyMessage?.icon ?? '📭'}</span>
        <p className="text-sm">{emptyMessage?.title ?? 'No transactions yet'}</p>
        {emptyMessage?.subtitle && (
          <p className="text-xs mt-1">{emptyMessage.subtitle}</p>
        )}
      </div>
    )
  }

  return (
    <ul className="divide-y divide-slate-100">
      {transactions.map(t => {
        const isIncome = t.type === 'income'
        return (
          <li key={t.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                  isIncome
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {isIncome ? '↑' : '↓'}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {t.category}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {t.description || (isIncome ? 'Income' : 'Expense')} · {t.date}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-semibold tabular-nums ${
                isIncome ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {isIncome ? '+' : '−'}
              {currency.format(t.amount)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
