/**
 * Transaction store — backed by Prisma + SQLite (Step 7), per-user (Step 9).
 *
 * Every read and write takes a `userId` and filters on it, so even with one
 * shared SQLite file each session only sees its own rows. The route handlers
 * and Server Components above read `auth()` and pass the id in.
 *
 * `validateTransaction` stays synchronous — it inspects the request body
 * and never touches the database.
 */

import { prisma } from './prisma'
import type { Transaction as PrismaTransaction } from '@/generated/prisma/client'

export type TransactionType = 'income' | 'expense'

// Re-export Prisma's generated row type so callers don't depend on the
// generated path. `createdAt` is a `Date` here; Response.json() serializes
// it to an ISO string on the wire.
export type Transaction = PrismaTransaction

export interface NewTransactionInput {
  type: unknown
  amount: unknown
  category: unknown
  date: unknown
  description?: unknown
}

export interface TransactionFilters {
  type?: TransactionType
  category?: string
  from?: string // YYYY-MM-DD (inclusive)
  to?: string   // YYYY-MM-DD (inclusive)
}

// All filters are optional. Empty strings (the natural value of an unset
// `<select>` or text input) are treated the same as `undefined`. Filtering
// happens in SQL so we don't pull every row into Node.
export async function listTransactions(userId: string, filters: TransactionFilters = {}): Promise<Transaction[]> {
  const where: Record<string, unknown> = { userId }
  if (filters.type === 'income' || filters.type === 'expense') where.type = filters.type
  if (filters.category && filters.category.length > 0) where.category = filters.category
  if (filters.from || filters.to) {
    const date: { gte?: string; lte?: string } = {}
    if (filters.from) date.gte = filters.from
    if (filters.to) date.lte = filters.to
    where.date = date
  }
  return prisma.transaction.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

export async function createTransaction(userId: string, input: NewTransactionInput): Promise<Transaction> {
  return prisma.transaction.create({
    data: {
      userId,
      type: input.type as TransactionType,
      amount: Number(input.amount),
      category: String(input.category),
      date: String(input.date),
      description: typeof input.description === 'string' ? input.description.trim() : '',
    },
  })
}

// Returns `true` if a row owned by the user was deleted, `false` otherwise.
// Doing the ownership check inside `deleteMany` prevents one user from
// guessing another user's id and erasing it.
export async function deleteTransaction(userId: string, id: string): Promise<boolean> {
  const { count } = await prisma.transaction.deleteMany({ where: { id, userId } })
  return count > 0
}

export interface DashboardStats {
  income: number
  expenses: number
  balance: number
  recent: Transaction[]
}

// Used by /dashboard. One round-trip per dataset (totals + recent list).
// `groupBy` aggregates in the database so we don't pull every row into Node.
export async function getDashboardStats(userId: string, recentLimit = 5): Promise<DashboardStats> {
  const [totals, recent] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: recentLimit,
    }),
  ])

  const income = totals.find(t => t.type === 'income')?._sum.amount ?? 0
  const expenses = totals.find(t => t.type === 'expense')?._sum.amount ?? 0

  return { income, expenses, balance: income - expenses, recent }
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
