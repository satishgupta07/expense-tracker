'use client'

import { useState } from 'react'

type TransactionType = 'expense' | 'income'

const CATEGORIES: Record<TransactionType, string[]> = {
  expense: ['Food', 'Transport', 'Housing', 'Utilities', 'Health', 'Entertainment', 'Shopping', 'Other'],
  income:  ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
}

interface FormState {
  type: TransactionType
  amount: string
  category: string
  date: string
  description: string
}

const today = new Date().toISOString().split('T')[0]

const initialState: FormState = {
  type: 'expense',
  amount: '',
  category: '',
  date: today,
  description: '',
}

export default function ExpenseForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function handleTypeToggle(type: TransactionType) {
    setForm({ ...initialState, type, date: form.date })
    setErrors({})
    setSubmitted(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      next.amount = 'Enter a valid amount greater than 0'
    }
    if (!form.category) {
      next.category = 'Please select a category'
    }
    if (!form.date) {
      next.date = 'Please select a date'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    // Step 6 will replace this with a real API call to POST /api/expenses
    console.log('New transaction:', {
      type: form.type,
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      description: form.description.trim(),
    })

    setSubmitted(true)
    setForm({ ...initialState, type: form.type })
    setErrors({})
  }

  const isIncome = form.type === 'income'

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-lg">

        {/* Success banner */}
        {submitted && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 text-sm font-medium">
            <span>✓</span>
            <span>Transaction saved! (API wired up in Step 6)</span>
          </div>
        )}

        {/* Type toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">Type</label>
          <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 gap-1">
            <button
              type="button"
              onClick={() => handleTypeToggle('expense')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isIncome
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeToggle('income')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isIncome
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label htmlFor="amount" className="block text-sm font-medium text-slate-600 mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition ${
                errors.amount ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'
              }`}
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div className="mb-5">
          <label htmlFor="category" className="block text-sm font-medium text-slate-600 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 transition appearance-none bg-white ${
              errors.category ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
            }`}
          >
            <option value="">Select a category</option>
            {CATEGORIES[form.type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
        </div>

        {/* Date */}
        <div className="mb-5">
          <label htmlFor="date" className="block text-sm font-medium text-slate-600 mb-1">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 transition bg-white ${
              errors.date ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
            }`}
          />
          {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
        </div>

        {/* Description */}
        <div className="mb-8">
          <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">
            Description <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Grocery run, Monthly rent…"
            value={form.description}
            onChange={handleChange}
            maxLength={120}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-3 rounded-xl font-semibold text-white text-sm transition-all shadow-sm active:scale-[.98] ${
            isIncome
              ? 'bg-emerald-500 hover:bg-emerald-400'
              : 'bg-violet-600 hover:bg-violet-500'
          }`}
        >
          {isIncome ? 'Add Income' : 'Add Expense'}
        </button>

      </div>
    </form>
  )
}
