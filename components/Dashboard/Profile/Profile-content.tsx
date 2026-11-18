"use client"

import { ProfileAvatar } from "@/components/Dashboard/Profile/Profile-avatar"
import { ProfileForm } from "@/components/Dashboard/Profile/Profile-form"
import { useAccountProfile } from "@/components/Dashboard/Account-profile-provider"
import { Skeleton } from "@/components/ui/skeleton"

function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your profile"
      aria-busy="true"
      className="grid gap-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10"
    >
      <span className="sr-only">Loading your profile...</span>
      <div className="flex items-center gap-6 md:flex-col md:items-start md:gap-5">
        <Skeleton className="size-24 shrink-0 rounded-full motion-reduce:animate-none sm:size-28" />
        <div className="grid flex-1 grid-cols-3 gap-4 md:w-full md:grid-cols-1 md:gap-3.5">
          {["Bookings", "Listings", "Member since"].map((item) => (
            <div key={item} className="space-y-1.5">
              <Skeleton className="h-3 w-14 motion-reduce:animate-none" />
              <Skeleton className="h-4 w-10 motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {["name", "email", "phone", "location"].map((field) => (
            <div key={field} className="space-y-2">
              <Skeleton className="h-3 w-16 motion-reduce:animate-none" />
              <Skeleton className="h-10 w-full rounded-xl motion-reduce:animate-none" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-8 motion-reduce:animate-none" />
          <Skeleton className="h-28 w-full rounded-xl motion-reduce:animate-none" />
          <Skeleton className="ml-auto h-3 w-12 motion-reduce:animate-none" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 w-36 rounded-xl motion-reduce:animate-none" />
          <Skeleton className="h-11 w-24 rounded-xl motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  )
}

export function ProfileContent() {
  const { account, loading, error, retry } = useAccountProfile()

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!account) {
    return (
      <div role="alert" className="space-y-3 text-sm text-destructive">
        <p>{error || "Sign in to view and edit your profile."}</p>
        {error && (
          <button
            type="button"
            onClick={retry}
            className="font-semibold underline underline-offset-4"
          >
            Try again
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="stagger-in grid gap-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10">
      <ProfileAvatar account={account} />
      <ProfileForm account={account} />
    </div>
  )
}
