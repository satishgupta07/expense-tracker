# Expense Tracker — Next.js Learning Project

A full-stack Expense Tracker app built step-by-step to learn **Next.js 14** with the App Router.

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via Prisma ORM |
| Auth | NextAuth.js |
| Charts | Recharts |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Concepts Covered

### 1. Project Setup
**What:** Scaffolding a Next.js app using `create-next-app`.

**Key files created:**
- `src/app/layout.tsx` — root layout (wraps all pages)
- `src/app/page.tsx` — home page mapped to "/"
- `next.config.ts` — Next.js configuration
- `tailwind.config.mjs` — Tailwind CSS configuration
- `tsconfig.json` — TypeScript configuration

**Key learning:** Next.js uses the `src/app/` directory as the root of your application. There is no `index.html` — Next.js handles HTML generation automatically.

---

### 2. App Router & File-based Routing
**What:** In Next.js, the **folder structure defines the URL routes**. No router configuration needed.

**How it works:**
```
src/app/page.tsx              →  /
src/app/dashboard/page.tsx    →  /dashboard
src/app/add-expense/page.tsx  →  /add-expense
src/app/history/page.tsx      →  /history
```

Every route folder needs a `page.tsx` file to be accessible as a URL.

**Comparison with React Router:**
```jsx
// React (manual router config)
<Route path="/dashboard" element={<Dashboard />} />

// Next.js (just create the folder + file)
src/app/dashboard/page.tsx  ← that's it
```

**Types of routing available in Next.js:**

| Type | Syntax | Example URL |
|------|--------|-------------|
| Static | `page.tsx` | `/dashboard` |
| Dynamic | `[id]/page.tsx` | `/expenses/123` |
| Nested | `a/b/page.tsx` | `/dashboard/settings` |
| Catch-all | `[...slug]/page.tsx` | `/docs/a/b/c` |
| Optional catch-all | `[[...slug]]/page.tsx` | `/docs` or `/docs/a/b` |
| Route Groups | `(group)/page.tsx` | `/login` (group name hidden from URL) |
| Parallel | `@slot/page.tsx` | Side-by-side views |
| Intercepting | `(..)route/page.tsx` | Modal-style overlays |

---

### 3. Layout System
**What:** `layout.tsx` wraps every page in your app. Anything placed inside it (Navbar, Footer) appears on all pages.

**How it works:**
```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        <main>{children}</main>  {/* ← active page renders here */}
      </body>
    </html>
  )
}
```

**Nested layouts:** Each folder can have its own `layout.tsx` that wraps only that section's pages — without affecting the rest of the app.

---

### 4. Server Components vs Client Components
**What:** Next.js introduces two types of components. This is one of the biggest differences from plain React.

**Server Components (default):**
- Run only on the server — never sent to the browser as JS
- Can directly fetch data, access databases, read environment variables
- Cannot use `useState`, `useEffect`, or browser APIs
- No `'use client'` directive needed

```tsx
// Server Component — runs on the server
export default async function Dashboard() {
  const data = await fetch('/api/expenses') // direct async call, no useEffect needed
  return <div>{data}</div>
}
```

**Client Components:**
- Run in the browser (like regular React components)
- Can use `useState`, `useEffect`, event handlers
- Must have `'use client'` at the top of the file

```tsx
'use client'  // ← opt in to client-side rendering

import { useState } from 'react'

export default function ExpenseForm() {
  const [amount, setAmount] = useState('')
  return <input value={amount} onChange={e => setAmount(e.target.value)} />
}
```

**Rule of thumb:** Start with Server Components. Add `'use client'` only when you need interactivity.

---

### 5. Rendering Strategies
**What:** Next.js lets you choose how and when each page's HTML is generated.

| Strategy | When HTML is built | Data freshness | Best for |
|----------|--------------------|----------------|----------|
| **CSR** (Client-Side) | In the browser | Always fresh | Highly interactive UI |
| **SSR** (Server-Side) | On the server, per request | Always fresh | Live data (expense list) |
| **SSG** (Static Generation) | At build time, once | Stale until rebuild | Rarely changing data |
| **ISR** (Incremental Static Regen) | Build time + every N seconds | Fresh every interval | Dashboards, summaries |

**How to control it (via `fetch` cache options):**
```tsx
// SSR — fresh on every request
fetch(url, { cache: 'no-store' })

// SSG — cached forever, built once
fetch(url, { cache: 'force-cache' })

// ISR — rebuilt every 60 seconds
fetch(url, { next: { revalidate: 60 } })
```

---

### 6. Navigation with `<Link>`
**What:** Use Next.js `<Link>` instead of `<a>` tags for internal navigation.

```tsx
import Link from 'next/link'

// Client-side navigation — no full page reload
<Link href="/dashboard">Dashboard</Link>

// vs regular anchor — causes full page reload
<a href="/dashboard">Dashboard</a>
```

**Why `<Link>` is better:**
- No full page reload — only changed content is updated
- Automatically prefetches pages when the link is visible
- Preserves React state across navigation

---

### 7. Metadata & SEO
**What:** Next.js has a built-in `metadata` API to set `<title>`, `<meta>` tags, and Open Graph data.

```tsx
// In layout.tsx — applies to all pages
export const metadata = {
  title: 'Expense Tracker',
  description: 'Track your income and expenses easily',
}

// In a specific page.tsx — overrides the layout's title
export const metadata = {
  title: 'Dashboard | Expense Tracker',
}
```

---

### 8. Redirect
**What:** `redirect()` from `next/navigation` sends the user to another page server-side.

```tsx
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')  // user visiting "/" is sent to "/dashboard"
}
```

This is the Next.js equivalent of `<Navigate to="/dashboard" />` in React Router.

---

### 5. Add Expense Form (Client Components)
**What:** The Add Expense page uses a Client Component (`ExpenseForm`) for the interactive form, while the page itself stays a Server Component to keep the `metadata` export.

**Key files created:**
- `src/components/ExpenseForm.tsx` — Client Component with form state, validation, and submit handler

**How it's structured:**
```
add-expense/page.tsx   ← Server Component (keeps metadata export)
  └── <ExpenseForm />  ← Client Component ('use client' — handles state & events)
```

**Key learning:** You don't need the whole page to be a Client Component. Keep the page as a Server Component and push `'use client'` down to only the interactive part. This minimises the client JS bundle.

**Form fields:**
- Type toggle (Expense / Income) — drives category options and button color
- Amount — validated, prefixed with `$`
- Category — options differ per type
- Date — defaults to today
- Description — optional free text

**Submit behaviour (Step 5):** Logs form data to `console.log`. A real `POST /api/expenses` call is wired up in Step 6.

---

### 6. API Routes (Route Handlers)
**What:** In the App Router, backend endpoints are **Route Handlers** — `route.ts` files placed inside `src/app/`. This replaces the old `pages/api` convention from the Pages Router.

**Key files created:**
- `src/app/api/expenses/route.ts` — `GET` (list) and `POST` (create) for `/api/expenses`
- `src/lib/transactions.ts` — store + validation (in-memory in Step 6, swapped for Prisma in Step 7)

**How Route Handlers work:**
```ts
// src/app/api/expenses/route.ts
export async function GET() {
  return Response.json(listTransactions())
}

export async function POST(request: Request) {
  const body = await request.json()
  // validate & create…
  return Response.json(created, { status: 201 })
}
```

Each named export (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`) maps to that HTTP verb. Unsupported methods return 405 automatically.

**Rules to remember:**
- Route Handlers use the standard Web `Request` and `Response` APIs
- A `route.ts` and `page.tsx` **cannot** live in the same folder (they'd conflict on the same URL)
- `Response.json(data, { status })` is the easiest way to send a JSON response with a status code
- Route Handlers are **not cached by default** — opt in with `export const dynamic = 'force-static'`

**Form ↔ API integration:**
The Add Expense form now calls the API instead of just logging to console:
```ts
await fetch('/api/expenses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
```
The form also handles loading state (button disabled + "Saving…") and surfaces server-side validation errors in a banner.

---

### 7. Database with Prisma (SQLite)
**What:** Replace the in-memory transaction store with a real database using **Prisma 7** + **SQLite**. The Route Handler doesn't change shape — only the helpers in `src/lib/transactions.ts` become `async`, and the route awaits them.

**Key files created:**
- `prisma/schema.prisma` — Transaction model
- `prisma/migrations/<timestamp>_init/migration.sql` — first migration
- `prisma.config.ts` — Prisma 7 moved connection config out of the schema into this file
- `prisma/dev.db` — SQLite database file (gitignored)
- `src/lib/prisma.ts` — singleton PrismaClient

**Prisma 7 — what's different from the older Prisma you may have seen:**

1. **No bundled engine.** You must pick a driver adapter — for local SQLite that's `@prisma/adapter-better-sqlite3` wrapping `better-sqlite3`. The legacy "bundled binary engine" is gone.

2. **`url` no longer lives in the schema.** It moved to `prisma.config.ts`:
   ```ts
   // prisma.config.ts
   export default defineConfig({
     schema: "prisma/schema.prisma",
     migrations: { path: "prisma/migrations" },
     datasource: { url: process.env["DATABASE_URL"] },
   });
   ```
   The schema's `datasource db { }` block only carries the `provider`.

3. **New `prisma-client` generator.** Output goes to a folder you choose (here, `src/generated/prisma`) instead of the legacy `@prisma/client` package. Import the typed client from there:
   ```ts
   import { PrismaClient } from '@/generated/prisma/client'
   ```
   The generated folder is gitignored — it's rebuilt on every `prisma generate`.

**Singleton pattern (avoids hot-reload connection leaks):**
```ts
// src/lib/prisma.ts
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@/generated/prisma/client'

const g = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! }),
  })
}

export const prisma = g.prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') g.prisma = prisma
```

**Helpers become async:**
```ts
// src/lib/transactions.ts (before — in-memory, sync)
export function listTransactions() { return [...transactions] }

// after — Prisma, async
export async function listTransactions() {
  return prisma.transaction.findMany({ orderBy: { createdAt: 'desc' } })
}
```

**Route Handler only adds `await`:**
```ts
// src/app/api/expenses/route.ts
export async function GET() {
  return Response.json(await listTransactions())
}
```

> **Good to know — Next 16:** Route Handlers are **not cached by default**. `GET` can opt in via `export const dynamic = 'force-static'`, but for a transactions list we want fresh data on every request, so we leave the default.

**Useful scripts:**
```bash
npm run db:migrate    # create + apply a new migration
npm run db:generate   # regenerate the Prisma client after schema edits
npm run db:studio     # browse data in a GUI
```

---

### 8. Connect UI to Database
**What:** Replace the placeholder UI on `/dashboard` and `/history` with live data fetched from Prisma. Both pages stay Server Components — Next.js lets them `await` the database directly, with no `useEffect` or client-side fetch.

**Key files created / changed:**
- `src/components/TransactionList.tsx` — shared list rendering for both pages (Server Component)
- `src/lib/transactions.ts` — adds `getDashboardStats()` (grouped totals + recent rows in one round-trip)
- `src/app/dashboard/page.tsx` — async Server Component, real numbers
- `src/app/history/page.tsx` — async Server Component, full list

**Key learning — async Server Components:**
```tsx
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  const { income, expenses, balance, recent } = await getDashboardStats()
  return <div>...</div>
}
```
The `async` here is what plain React doesn't allow. Because the component runs only on the server, awaiting a database query is fine — the HTML isn't sent until the data resolves. The browser never sees the loading state.

**Aggregating in the database, not in Node:**
```ts
const totals = await prisma.transaction.groupBy({
  by: ['type'],
  _sum: { amount: true },
})
```
`groupBy` produces one row per `type` ("income" / "expense") with the sum already computed. SQLite does the heavy lifting; we don't pull every transaction into Node to add them up.

**Static vs. dynamic rendering:**
```ts
export const dynamic = 'force-dynamic'
```
By default, Next 16 may try to **prerender** a Server Component at build time. A dashboard that read from SQLite at build time would always show zero in production. `force-dynamic` opts the page into per-request rendering. (You could also opt in by reading runtime APIs like `headers()` or `cookies()` — `force-dynamic` is just the most explicit way.)

**Deferred to Step 8b:**
- A filter bar on `/history` (type, category, date range) driven by URL search params
- Per-row Delete button + `DELETE /api/expenses/[id]` Route Handler

---

### 8b. History Filters + Delete
**What:** Layer two missing features onto `/history`: filter by type/category/date range, and delete a transaction inline.

**Key files created / changed:**
- `src/app/api/expenses/[id]/route.ts` — `DELETE` Route Handler for one transaction
- `src/components/HistoryFilters.tsx` — server-rendered filter form
- `src/components/DeleteTransactionButton.tsx` — Client Component
- `src/lib/transactions.ts` — `listTransactions(filters)` + `deleteTransaction(id)`
- `src/app/history/page.tsx` — reads `searchParams`, passes filters down, enables Delete

**Dynamic segments — `[id]`:**
```
src/app/api/expenses/[id]/route.ts  →  /api/expenses/:id
```
Folder names in square brackets become URL params. In Next 16, `params` arrives as a Promise (typed by the auto-generated `RouteContext<'/api/expenses/[id]'>` helper):
```ts
export async function DELETE(_req: Request, ctx: RouteContext<'/api/expenses/[id]'>) {
  const { id } = await ctx.params
  await deleteTransaction(id)
  return new Response(null, { status: 204 })
}
```

**Filtering via URL search params (no JavaScript needed):**
```tsx
<form method="get" action="/history">
  <select name="type">...</select>
  <select name="category">...</select>
  <input type="date" name="from" />
  <input type="date" name="to" />
  <button>Apply</button>
</form>
```
Submitting the form navigates to `/history?type=expense&category=Food&from=…&to=…`. The page is a Server Component that reads those values from `searchParams` and passes them to `listTransactions(filters)`. Filtering is done in SQL via Prisma's `where`, so the database only sends back matching rows.

> **Good to know:** In Next 16, `searchParams` is a Promise too — `await` it before reading. The same is true of `cookies()`, `headers()`, and dynamic `params`.

**Optimistic refresh after Delete:**
```tsx
'use client'
import { useRouter } from 'next/navigation'

const router = useRouter()
await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
router.refresh()    // re-runs Server Component data fetch — no full reload
```
`router.refresh()` is the App Router equivalent of "refetch this page on the server, then patch the DOM." The row disappears in place.

---

### 9. Authentication with Auth.js (Credentials) + per-user data
**What:** Add email/password sign-up and sign-in using **Auth.js v5** (NextAuth's successor), scope every transaction to its owner, and gate every page behind a Next.js middleware.

**Key files created:**
- `src/auth.ts` — Auth.js config with the Credentials provider + JWT session callbacks
- `src/middleware.ts` — redirects anonymous users to `/sign-in` for every page route
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js catch-all handler (sign-in / sign-out / session)
- `src/app/api/auth/signup/route.ts` — user-creation endpoint (bcrypt-hashed password)
- `src/app/sign-in/page.tsx`, `src/app/sign-up/page.tsx` — Server Component shells
- `src/components/SignInForm.tsx`, `src/components/SignUpForm.tsx` — Client Components
- `src/components/SignOutButton.tsx` — calls `signOut()` from `next-auth/react`
- `src/types/next-auth.d.ts` — augments `session.user.id` into the Auth.js types

**Schema (Step 9 migration):**
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  name         String?
  passwordHash String
  createdAt    DateTime @default(now())
  transactions Transaction[]
}

model Transaction {
  // ...existing fields...
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, createdAt])
}
```
`onDelete: Cascade` means deleting a User automatically drops all of their Transaction rows — no orphan data.

**Auth.js v5 — what's different from NextAuth v4:**
1. **Single config, multiple exports.** `NextAuth(config)` returns `{ handlers, auth, signIn, signOut }`. The handler goes into `route.ts`; `auth()` is what Server Components / Route Handlers call to read the session.
2. **Built-in middleware.** `auth` can be used directly as Next.js middleware — it surfaces the session on `req.auth`.
3. **Env inference.** `AUTH_SECRET`, `AUTH_GITHUB_ID`, etc. are picked up automatically. Generate the secret with `npx auth secret`.

**JWT sessions for Credentials:**
The Credentials provider requires `session: { strategy: 'jwt' }`. We stuff the user id into the JWT in the `jwt` callback and read it back in the `session` callback so every consumer can rely on `session.user.id`.

**Per-user scoping (the store layer enforces it):**
```ts
// before — anyone could read anyone's rows
export async function listTransactions(filters) { ... }

// after — userId is the first argument, baked into every where clause
export async function listTransactions(userId: string, filters) {
  return prisma.transaction.findMany({ where: { userId, ...filters }, ... })
}

// delete checks ownership inside the same query
export async function deleteTransaction(userId: string, id: string) {
  const { count } = await prisma.transaction.deleteMany({ where: { id, userId } })
  return count > 0
}
```
The handler reads the session and passes the id in. If anyone forgets, TypeScript yells.

**Route Handlers and pages now always start with:**
```ts
const session = await auth()
if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })
```
Pages do the same dance but call `redirect('/sign-in?callbackUrl=…')` instead of returning a 401.

**Middleware route protection:**
```ts
// src/middleware.ts
export default auth(req => {
  const isAuthed = Boolean(req.auth?.user)
  if (!isAuthed && !PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/sign-in?callbackUrl=' + req.nextUrl.pathname, req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```
The matcher excludes `/api/*` because we want API routes to return JSON 401s, not HTML redirects.

> **Good to know — env:** generate a real secret with `npx auth secret` and set `AUTH_SECRET=` in `.env` (the placeholder string here is dev-only).

---

### 10. Charts with Recharts
**What:** Add a per-category expense pie chart to the dashboard using **Recharts**.

**Key files created / changed:**
- `src/components/ExpensePieChart.tsx` — Client Component (Recharts needs the DOM)
- `src/lib/transactions.ts` — adds `getExpenseBreakdown(userId)` (SQL `groupBy` over `expense` rows)
- `src/app/dashboard/page.tsx` — fetches breakdown in parallel with the existing stats and renders the chart in a side-by-side grid with Recent Transactions

**Why the chart is a Client Component:**
Recharts paints SVG using browser DOM APIs (`getBoundingClientRect`, `ResizeObserver`, …). Trying to render it inside a Server Component would crash at build time. The pattern we use everywhere else also applies here: **fetch the data on the server, pass plain JSON to the Client Component, let it handle the visual.**

```tsx
// Server Component
const breakdown = await getExpenseBreakdown(session.user.id)
return <ExpensePieChart data={breakdown} />
```

```tsx
'use client'
// Client Component
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ExpensePieChart({ data }: { data: CategoryBreakdownEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie data={data} dataKey="amount" nameKey="category" innerRadius={60} outerRadius={110}>
          {data.map((d, i) => <Cell key={d.category} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
```

**Aggregating in the database, not in Node:**
```ts
const rows = await prisma.transaction.groupBy({
  by: ['category'],
  where: { userId, type: 'expense' },
  _sum: { amount: true },
  orderBy: { _sum: { amount: 'desc' } },
})
```
Same pattern as Step 8's `groupBy` for income/expense totals — SQLite returns one row per category with the sum already computed.

**Parallel fetches in the page:**
```ts
const [{ income, expenses, balance, recent }, breakdown] = await Promise.all([
  getDashboardStats(session.user.id),
  getExpenseBreakdown(session.user.id),
])
```
Both queries leave together and the page renders when the slower one returns.

---

## Project Structure

```
expense-tracker/
├── prisma/
│   ├── schema.prisma           ← Transaction model
│   ├── migrations/             ← Generated SQL migrations (committed)
│   └── dev.db                  ← SQLite database (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout (Navbar, global styles)
│   │   ├── page.tsx                ← "/" — redirects to /dashboard
│   │   ├── globals.css             ← Global CSS + color variables
│   │   ├── dashboard/page.tsx      ← "/dashboard"
│   │   ├── add-expense/page.tsx    ← "/add-expense"
│   │   ├── history/page.tsx        ← "/history"
│   │   ├── sign-in/page.tsx        ← "/sign-in"
│   │   ├── sign-up/page.tsx        ← "/sign-up"
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts  ← Auth.js handlers
│   │       │   └── signup/route.ts         ← POST /api/auth/signup
│   │       └── expenses/
│   │           ├── route.ts        ← GET + POST /api/expenses
│   │           └── [id]/route.ts   ← DELETE /api/expenses/:id
│   ├── auth.ts                         ← Auth.js v5 config
│   ├── middleware.ts                   ← Route protection
│   ├── components/
│   │   ├── Navbar.tsx                  ← Shared navigation bar
│   │   ├── ExpenseForm.tsx             ← Client Component form
│   │   ├── TransactionList.tsx         ← Shared list (Server Component)
│   │   ├── HistoryFilters.tsx          ← Filter form (Server Component)
│   │   ├── DeleteTransactionButton.tsx ← Per-row delete (Client Component)
│   │   ├── SignInForm.tsx              ← Sign-in form (Client Component)
│   │   ├── SignUpForm.tsx              ← Sign-up form (Client Component)
│   │   ├── SignOutButton.tsx           ← Sign-out (Client Component)
│   │   └── ExpensePieChart.tsx         ← Dashboard pie chart (Client Component)
│   ├── generated/
│   │   └── prisma/                 ← Generated Prisma client (gitignored)
│   └── lib/
│       ├── prisma.ts               ← PrismaClient singleton
│       └── transactions.ts         ← Prisma-backed CRUD + validation
├── public/                     ← Static assets
├── next.config.ts              ← Next.js config
├── prisma.config.ts            ← Prisma 7 config (schema path, DB url)
├── tailwind.config.mjs         ← Tailwind config
└── tsconfig.json               ← TypeScript config
```

---

## Roadmap

| Step | Topic | Status |
|------|-------|--------|
| 1 | Project Setup | Done |
| 2 | Pages & File-based Routing | Done |
| 3 | Layouts & Navbar | Done |
| 4 | Rendering Strategies | Done (theory) |
| 5 | Add Expense Form (Client Components) | Done |
| 6 | API Routes (Route Handlers) | Done |
| 7 | Database with Prisma | Done |
| 8 | Connect UI to Database | Done (read-only) |
| 8b | History filters + delete | Done |
| 9 | Authentication with Auth.js | Done |
| 10 | Charts with Recharts | Done |
