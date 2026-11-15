"use client"

import { useTheme } from "next-themes"
import * as React from "react"

/**
 * Switch the theme with a soft color fade.
 * It adds `theme-transition` to <html> for a moment (see globals.css),
 * so colors animate only while switching, not on every hover/scroll.
 *
 * `theme` is the saved choice ("dark" | "light" | "system"),
 * `resolvedTheme` is what is actually showing ("dark" | "light").
 */
export function useSmoothTheme() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const timer = React.useRef<number | undefined>(undefined)

  const applyTheme = React.useCallback(
    (next: string) => {
      const root = document.documentElement
      root.classList.add("theme-transition")
      window.clearTimeout(timer.current)
      setTheme(next)
      timer.current = window.setTimeout(
        () => root.classList.remove("theme-transition"),
        600
      )
    },
    [setTheme]
  )

  const toggleTheme = React.useCallback(
    () => applyTheme(resolvedTheme === "dark" ? "light" : "dark"),
    [applyTheme, resolvedTheme]
  )

  return { theme, resolvedTheme, setTheme: applyTheme, toggleTheme }
}