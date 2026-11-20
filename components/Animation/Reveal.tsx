"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type RevealProps = {
  /** Milliseconds to wait before this element starts animating. */
  delay?: number
  /** Render as "li"/"ol" to keep list semantics inside native lists. */
  as?: "div" | "li" | "ol"
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

/**
 * Shared scroll-triggered fade-up (IntersectionObserver).
 * Styles live in app/animations.css — keep stagger logic here, not per page.
 */
export function Reveal({
  delay = 0,
  as = "div",
  className,
  style,
  children,
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null)
  const [visible, setVisible] = React.useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    if (visible) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [visible])

  const classes = cn("reveal", visible && "is-visible", className)
  const revealStyle = {
    ...style,
    "--reveal-delay": `${delay}ms`,
  } as React.CSSProperties

  const Tag = as as React.ElementType

  return (
    <Tag ref={ref as never} className={classes} style={revealStyle}>
      {children}
    </Tag>
  )
}
