/**
 * In-memory transaction store.
 *
 * NOTE: This module is a placeholder for Step 6.
 * Step 7 will replace these helpers with Prisma queries against SQLite,
 * but the public API (listTransactions, createTransaction) will stay the same
 * so the Route Handler doesn't need to change.
 */

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  date: string        // ISO date — YYYY-MM-DD
  description: string
  createdAt: string   // ISO timestamp
}

export interface NewTransactionInput {
  type: unknown
  amount: unknown
  category: unknown
  date: unknown
  description?: unknown
}

const transactions: Transaction[] = []

export function listTransactions(): Transaction[] {
  // Newest first
  return [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function createTransaction(input: NewTransactionInput): Transaction {
  const t: Transaction = {
    id: crypto.randomUUID(),
    type: input.type as TransactionType,
    amount: Number(input.amount),
    category: String(input.category),
    date: String(input.date),
    description: typeof input.description === 'string' ? input.description.trim() : '',
    createdAt: new Date().toISOString(),
  }
  transactions.push(t)
  return t
}

const VALID_TYPES: TransactionType[] = ['income', 'expense']
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function validateTransaction(input: NewTransactionInput): string | null {
  if (input.type !== 'income' && input.type !== 'expense') {
    return `type must be one of: ${VALID_TYPES.join(', ')}`
  }
  const amount = Number(input.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'amount must be a number greater than 0'
  }
  if (typeof input.category !== 'string' || input.category.trim() === '') {
    return 'category is required'
  }
  if (typeof input.date !== 'string' || !ISO_DATE.test(input.date)) {
    return 'date must be in YYYY-MM-DD format'
  }
  return null
}
