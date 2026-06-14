'use client'

/**
 * DeleteTransactionButton
 *
 * Tiny Client Component that POSTs a DELETE to /api/expenses/[id] and tells
 * the App Router to refetch the current page on success. `router.refresh()`
 * re-runs the Server Component data fetch without a hard reload, so the row
 * disappears in place.
 */

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteTransactionButton({ id }: { id: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (!window.confirm('Delete this transaction? This cannot be undone.')) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? `Delete failed (${res.status})`)
        return
      }
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-label="Delete transaction"
        className="ml-2 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50"
      >
        {busy ? '…' : '✕'}
      </button>
      {error && <span className="mt-1 text-[10px] text-rose-500">{error}</span>}
    </div>
  )
}
