/**
 * Prisma client singleton.
 *
 * In dev, Next.js hot-reloads server modules — each reload would create a new
 * PrismaClient and leak DB connections. Caching the instance on `globalThis`
 * keeps a single client across reloads. In prod, modules load exactly once,
 * so this is effectively just `new PrismaClient()`.
 *
 * Prisma 7 requires a driver adapter for SQLite — the legacy bundled engine
 * is gone. `PrismaBetterSqlite3` wraps the `better-sqlite3` driver and reads
 * the file path from `DATABASE_URL` (configured in `prisma.config.ts`).
 */

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
