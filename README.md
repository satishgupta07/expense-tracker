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

## Project Structure

```
expense-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout (Navbar, global styles)
│   │   ├── page.tsx            ← "/" — redirects to /dashboard
│   │   ├── globals.css         ← Global CSS + color variables
│   │   ├── dashboard/
│   │   │   └── page.tsx        ← "/dashboard"
│   │   ├── add-expense/
│   │   │   └── page.tsx        ← "/add-expense"
│   │   └── history/
│   │       └── page.tsx        ← "/history"
│   └── components/
│       └── Navbar.tsx          ← Shared navigation bar
├── public/                     ← Static assets
├── next.config.ts              ← Next.js config
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
| 6 | API Routes | Upcoming |
| 7 | Database with Prisma | Upcoming |
| 8 | Connect UI to Database | Upcoming |
| 9 | Authentication with NextAuth | Upcoming |
| 10 | Charts with Recharts | Upcoming |
