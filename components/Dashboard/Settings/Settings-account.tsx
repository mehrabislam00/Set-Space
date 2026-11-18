"use client"

import Link from "next/link"

import { useAccountProfile } from "@/components/Dashboard/Account-profile-provider"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { SettingsSection } from "./Settings-section"

export function SettingsAccount({
  showEditProfile = true,
}: {
  /** Hide the "Edit profile" link where the profile page isn't part of the section (e.g. Hosting). */
  showEditProfile?: boolean
}) {
  const { user, loading } = useAccountProfile()

  return (
    <SettingsSection
      id="account"
      title="Account"
      description="Your personal information"
    >
      <div
        className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
        aria-busy={loading}
      >
        <div className="min-w-0">
          {loading ? (
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-40 motion-reduce:animate-none" />
            </div>
          ) : (
            <>
              <p className="truncate font-heading text-sm font-bold text-foreground">
                {user?.name || "SetSpace member"}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {user?.email || ""}
              </p>
            </>
          )}
        </div>
        {showEditProfile && (
          <Link
            href="/dashboard/profile"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "btn-alive h-8 shrink-0 rounded-lg px-3 text-[11px] font-semibold"
            )}
          >
            Edit profile
          </Link>
        )}
      </div>
    </SettingsSection>
  )
}
