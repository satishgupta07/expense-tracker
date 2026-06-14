'use client'

/**
 * ExpensePieChart — Recharts pie chart of per-category expenses.
 *
 * Client Component (`'use client'`) — Recharts renders to SVG using DOM APIs
 * that don't exist on the server. The Server Component above (DashboardPage)
 * does the database aggregation and passes plain JSON in.
 *
 * `ResponsiveContainer` is the standard Recharts pattern for "fill the
 * parent box" — we give the wrapper a fixed height and Recharts handles
 * width responsively.
 */

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import type { CategoryBreakdownEntry } from '@/lib/transactions'

// Picked to read well on the white card behind the chart. If a user has
// more categories than colours, Recharts repeats from the start of the list.
const COLORS = [
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f97316', // orange-500
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#facc15', // yellow-400
  '#14b8a6', // teal-500
  '#ef4444', // red-500
]

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function ExpensePieChart({ data }: { data: CategoryBreakdownEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <span className="text-4xl mb-3">🥧</span>
        <p className="text-sm">No expenses to chart yet</p>
        <p className="text-xs mt-1">Add a few expenses to see the breakdown</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={value => currency.format(Number(value))}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: '#475569' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
