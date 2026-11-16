import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { SettingsAccount } from "@/components/Dashboard/Settings/Settings-account"
import { SettingsDanger } from "@/components/Dashboard/Settings/Settings-danger"
import { SettingsSecurity } from "@/components/Dashboard/Settings/Settings-security"
import { SettingsAppearance } from "@/components/Dashboard/Settings/Settings-appearance"
import { SettingsNotifications } from "@/components/Dashboard/Settings/Settings-notifications"


export const metadata: Metadata = {
  title: "Host Settings — SetSpace",
  description: "Manage your hosting account, notifications, appearance and security.",
}

export default function HostSettingsPage() {
  return (
    <div>
      <Reveal>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Settings
        </h1>
      </Reveal>

      <Reveal delay={80} className="mt-6">
        {/* the profile page lives in the renter dashboard, so Hosting hides that link */}
        <SettingsAccount showEditProfile={false} />
        <SettingsNotifications />
        <SettingsAppearance />
        <SettingsSecurity />
        <SettingsDanger />
      </Reveal>
    </div>
  )
}