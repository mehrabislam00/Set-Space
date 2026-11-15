"use client"

import { usePathname } from "next/navigation"

import { authRoutes } from "@/lib/Site-data"

/** Wraps the Navbar / Footer in the root layout and hides them on the
 *  full-screen auth pages (`authRoutes` in lib/Site-data.ts). */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (authRoutes.some((route) => pathname.startsWith(route))) return null

  return <>{children}</>
}