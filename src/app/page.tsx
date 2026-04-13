/**
 * Home Page — "/"
 *
 * This is a Server Component (no 'use client' directive).
 * Server Components run only on the server — never in the browser.
 *
 * `redirect()` is a Next.js function that sends the user to another page.
 * Here we immediately send anyone visiting "/" to "/dashboard".
 *
 * This is the Next.js equivalent of <Navigate to="/dashboard" /> in React Router.
 */

import { redirect } from "next/navigation";

export default function Home() {
  // As soon as someone visits "/", redirect them to the dashboard
  redirect("/dashboard");
}
