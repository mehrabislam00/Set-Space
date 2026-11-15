"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

/**
 * Wraps page content in the root layout. The key forces a remount on every
 * navigation so the `page-enter` fade-up (app/animations.css) replays as the
 * entrance of each new page. Navbar and Footer live outside and stay mounted.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  )
}
