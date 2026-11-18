"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

// Sections whose layout owns a persistent sidebar (app/dashbord/layout.tsx and
// app/host/layout.tsx). Every route inside one section shares a key, so that
// layout, sidebar included, stays mounted while you navigate within it.
const sections = [
  { prefixes: ["/dashboard", "/dashbord"], key: "dashboard" },
  { prefixes: ["/host"], key: "host" },
]

function transitionKey(pathname: string, scope: "site" | "content") {
  if (scope === "content") return pathname

  const section = sections.find(({ prefixes }) =>
    prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  )
  return section?.key ?? pathname
}

/**
 * Remounts its children when the key changes, so the `page-enter` fade
 * (app/animations.css) replays as the entrance of each new page.
 *
 * - scope="site" (root layout, default): keyed per page, except inside a
 *   section above, which is keyed per section so its sidebar never remounts.
 * - scope="content" (inside a section layout): keyed per page, so only the
 *   content area fades when the route changes.
 *
 * Navbar and Footer live outside and stay mounted.
 */
export function PageTransition({
  children,
  scope = "site",
}: {
  children: React.ReactNode
  scope?: "site" | "content"
}) {
  const pathname = usePathname()

  return (
    <div key={transitionKey(pathname, scope)} className="page-enter flex-1">
      {children}
    </div>
  )
}
