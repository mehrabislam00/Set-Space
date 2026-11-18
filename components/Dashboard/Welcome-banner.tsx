"use client"

import Image from "next/image"

import heroStudio from "@/assets/hero-studio.jpg"
import { useAccountProfile } from "@/components/Dashboard/Account-profile-provider"

export function WelcomeBanner() {
  const { user, loading } = useAccountProfile()
  const firstName = user?.name.split(" ")[0] || "there"

  return (
    <section
      className="relative isolate overflow-hidden rounded-2xl border border-border"
      aria-busy={loading}
    >
      <Image
        src={heroStudio}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 900px, 100vw"
        className="img-in -z-20 object-cover object-right"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/10" />

      <div className="px-6 py-9 sm:px-9">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-photo sm:text-4xl">
          Welcome back,{" "}
          {loading ? (
            <span
              aria-hidden
              className="skeleton-pulse inline-block h-6 w-24 rounded-md bg-white/20 align-middle sm:h-9 sm:w-36"
            />
          ) : (
            firstName
          )}
          !
        </h1>
        <p className="mt-2 text-xs text-photo-muted sm:text-sm">
          Here&apos;s what&apos;s happening with your SetSpace account.
        </p>
      </div>
    </section>
  )
}
