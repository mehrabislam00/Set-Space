import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { SettingsAccount } from "@/components/Dashboard/Settings/Settings-account"
import { SettingsDanger } from "@/components/Dashboard/Settings/Settings-danger"
import { SettingsSecurity } from "@/components/Dashboard/Settings/Settings-security"
import { SettingsAppearance } from "@/components/Dashboard/Settings/Settings-appearance"
import { SettingsNotifications } from "@/components/Dashboard/Settings/Settings-notifications"


export const metadata: Metadata = {
  title: "Settings — SetSpace",
  description: "Manage your account, notifications, appearance and security.",
}

export default function SettingsPage() {
  return (
    <div>
      <Reveal>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Settings
        </h1>
      </Reveal>

      <Reveal delay={80} className="mt-6">
        <SettingsAccount />
        <SettingsNotifications />
        <SettingsAppearance />
        <SettingsSecurity />
        <SettingsDanger />
      </Reveal>
    </div>
  )
}