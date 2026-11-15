"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "amenities", label: "Amenities" },
  { id: "host", label: "Host" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
]

/** Sticky section nav with scroll-spy. Each target section needs a matching id. */
export function StudioTabs() {
  const [active, setActive] = React.useState(tabs[0].id)

  React.useEffect(() => {
    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-140px 0px -60% 0px" }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    setActive(id)
  }

  return (
    <nav
      aria-label="Studio sections"
      className="sticky top-20 z-30 -mx-1 overflow-x-auto overflow-y-hidden border-b border-border bg-background/90 px-1 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex gap-6">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <a
              href={`#${tab.id}`}
              onClick={(e) => go(e, tab.id)}
              aria-current={active === tab.id ? "true" : undefined}
              className={cn(
                "block border-b-2 py-3.5 text-xs font-medium whitespace-nowrap transition-colors duration-300 motion-reduce:transition-none",
                active === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}