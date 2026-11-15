"use client"

import * as React from "react"

import { Switch } from "@/components/ui/switch"
import { notificationPrefs } from "@/lib/Dashboard-data"
import { SettingsSection } from "./Settings-section"

export function SettingsNotifications() {
  const [prefs, setPrefs] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(notificationPrefs.map((p) => [p.id, p.defaultOn]))
  )

  function change(id: string, value: boolean) {
    // TODO: save the preference to your API
    setPrefs((current) => ({ ...current, [id]: value }))
  }

  return (
    <SettingsSection
      id="notifications"
      title="Notifications"
      description="Choose what we send you"
    >
      <ul className="space-y-5">
        {notificationPrefs.map((pref) => (
          <li key={pref.id} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p
                id={`${pref.id}-label`}
                className="text-xs font-bold text-foreground"
              >
                {pref.label}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {pref.description}
              </p>
            </div>
            <Switch
              checked={prefs[pref.id]}
              onCheckedChange={(value) => change(pref.id, value)}
              aria-labelledby={`${pref.id}-label`}
            />
          </li>
        ))}
      </ul>
    </SettingsSection>
  )
}