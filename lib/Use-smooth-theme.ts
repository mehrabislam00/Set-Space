"use client"

import { useTheme } from "next-themes"
import * as React from "react"

/**
 * Toggle light/dark with a soft color fade.
 * It adds `theme-transition` to <html> for a moment (see globals.css),
 * so colors animate only while switching, not on every hover/scroll.
 */
export function useSmoothTheme() {
  const { resolvedTheme, setTheme } = useTheme()
  const timer = React.useRef<number | undefined>(undefined)

  const toggleTheme = React.useCallback(() => {
    const root = document.documentElement
    root.classList.add("theme-transition")
    window.clearTimeout(timer.current)
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    timer.current = window.setTimeout(
      () => root.classList.remove("theme-transition"),
      600
    )
  }, [resolvedTheme, setTheme])

  return { resolvedTheme, toggleTheme }
}