/**
 * Transaction store — backed by Prisma + SQLite (Step 7).
 *
 * The Step 6 version of this file kept transactions in an in-memory array.
 * Step 7 swaps the storage layer for a real database without changing the
 * function names, so the Route Handler at src/app/api/expenses/route.ts only
 * needs to `await` the now-async helpers.
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

export async function listTransactions(): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function createTransaction(input: NewTransactionInput): Promise<Transaction> {
  return prisma.transaction.create({
    data: {
      type: input.type as TransactionType,
      amount: Number(input.amount),
      category: String(input.category),
      date: String(input.date),
      description: typeof input.description === 'string' ? input.description.trim() : '',
    },
  })
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
