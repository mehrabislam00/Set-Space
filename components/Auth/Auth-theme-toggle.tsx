"use client"

import { Moon, Sun } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { useSmoothTheme } from "@/lib/Use-smooth-theme"

/** Round light/dark toggle for the auth pages (same behavior as the Navbar's). */
export function AuthThemeToggle() {
  const { resolvedTheme, toggleTheme } = useSmoothTheme()
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const isDark = mounted ? resolvedTheme === "dark" : true

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="btn-flat group size-9 rounded-full"
    >
      {isDark ? (
        <Sun className="size-4 transition-transform duration-500 group-hover:rotate-90" />
      ) : (
        <Moon className="size-4 transition-transform duration-500 group-hover:-rotate-12" />
      )}
    </Button>
  )
}