"use client"

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
import * as React from "react"

import { useSmoothTheme } from "@/lib/Use-smooth-theme"
import { cn } from "@/lib/utils"
import { SettingsSection } from "./Settings-section"

const options: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
]

export function SettingsAppearance() {
  const { theme, setTheme } = useSmoothTheme()
  // The saved theme is unknown on the server, so wait for the client before highlighting
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  return (
    <SettingsSection
      id="appearance"
      title="Appearance"
      description="Pick how SetSpace looks"
    >
      <div
        role="radiogroup"
        aria-label="Theme"
        className="grid grid-cols-3 gap-3"
      >
        {options.map(({ value, label, icon: Icon }) => {
          const selected = mounted && theme === value

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTheme(value)}
              className={cn(
                "flex h-14 flex-col justify-between rounded-xl border p-3 text-left outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                selected
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <Icon className="size-3.5 text-primary" strokeWidth={1.5} />
              <span className="text-xs font-bold text-foreground">{label}</span>
            </button>
          )
        })}
      </div>
    </SettingsSection>
  )
}