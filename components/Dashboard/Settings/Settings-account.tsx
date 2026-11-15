import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { dashboardUser } from "@/lib/Dashboard-data"
import { cn } from "@/lib/utils"
import { SettingsSection } from "./Settings-section"

export function SettingsAccount() {
  return (
    <SettingsSection
      id="account"
      title="Account"
      description="Your personal information"
    >
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold text-foreground">
            {dashboardUser.name}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {dashboardUser.email}
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "btn-alive h-8 shrink-0 rounded-lg px-3 text-[11px] font-semibold"
          )}
        >
          Edit profile
        </Link>
      </div>
    </SettingsSection>
  )
}