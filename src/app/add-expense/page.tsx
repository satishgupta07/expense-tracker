import ExpenseForm from '@/components/ExpenseForm'

export const metadata = {
  title: 'Add Expense | Expense Tracker',
}

export default function AddExpensePage() {
  return (
    <div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Add Transaction</h1>
        <p className="mt-1 text-slate-500">Record a new income or expense</p>
      </div>

      {/* Client Component — handles all interactivity */}
      <ExpenseForm />

    </div>
  )
}
