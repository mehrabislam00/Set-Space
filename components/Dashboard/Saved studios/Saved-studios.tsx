"use client"

import Link from "next/link"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { savedStudioIds } from "@/lib/Dashboard-data"
import { exploreStudios } from "@/lib/Site-data"
import { cn } from "@/lib/utils"
import { SavedStudioCard } from "./Saved-studio-card"


/** Saved studios grid with a live count. Removing a card updates the list instantly. */
export function SavedStudios() {
  const [ids, setIds] = React.useState(savedStudioIds)

  const studios = ids
    .map((id) => exploreStudios.find((studio) => studio.id === id))
    .filter((studio) => studio !== undefined)

  function remove(id: number) {
    // TODO: call your unsave API
    setIds((list) => list.filter((savedId) => savedId !== id))
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
          {studios.length} {studios.length === 1 ? "studio" : "studios"} saved
        </p>
      </header>

      {studios.length === 0 ? (
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
              onRemove={() => remove(studio.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}