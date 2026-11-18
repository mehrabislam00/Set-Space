"use client"

import Link from "next/link"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { useWishlist } from "@/components/Dashboard/Wishlist-provider"
import { MarketplaceApiError } from "@/lib/Marketplace-api"
import { toExploreStudio } from "@/lib/Studio-api"
import { cn } from "@/lib/utils"
import { SavedStudioCard } from "./Saved-studio-card"

/** Saved studios grid with a live count. Removing a card updates the list instantly. */
export function SavedStudios() {
  const {
    error,
    isPending,
    retry,
    status,
    studios: savedRecords,
    toggleStudio,
  } = useWishlist()
  const studios = React.useMemo(
    () => savedRecords.map(toExploreStudio),
    [savedRecords]
  )

  async function remove(id: number | string) {
    if (typeof id !== "string") return
    try {
      await toggleStudio(id)
    } catch (removeError) {
      if (!(removeError instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    }
  }

  return (
    <section aria-labelledby="saved-heading">
      <header>
        <h1
          id="saved-heading"
          className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
        >
          Saved Studios
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {status === "ready"
            ? `${studios.length} ${studios.length === 1 ? "studio" : "studios"} saved`
            : "Your saved studios"}
        </p>
      </header>

      {status === "loading" ? (
        <div
          aria-busy="true"
          className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[0, 1, 2].map((item) => (
            <div key={item} aria-hidden="true" className="space-y-4">
              <Skeleton className="aspect-[4/3] rounded-2xl motion-reduce:animate-none" />
              <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-1/2 motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      ) : status === "signed-out" ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="font-heading text-base font-bold text-foreground">
            Sign in to view saved studios
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Save studios to keep them together here.
          </p>
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg" }), "btn-alive mt-5")}
          >
            Sign in
          </Link>
        </div>
      ) : status === "error" ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
        >
          <p className="text-sm text-foreground">
            {error || "Saved studios could not be loaded."}
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 text-xs font-semibold text-primary underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      ) : studios.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="font-heading text-base font-bold text-foreground">
            No saved studios yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap the heart on any studio to keep it here for later.
          </p>
          <Link
            href="/explore-studio"
            className={cn(buttonVariants({ size: "lg" }), "btn-alive mt-5")}
          >
            Explore Studios
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <SavedStudioCard
              key={studio.id}
              studio={studio}
              onRemove={() => void remove(studio.id)}
              pending={typeof studio.id === "string" && isPending(studio.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
