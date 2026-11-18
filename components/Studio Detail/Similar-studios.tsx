"use client"

import Link from "next/link"
import * as React from "react"

import { Reveal } from "@/components/Animation/Reveal"
import { Skeleton } from "@/components/ui/skeleton"
import { getPublicStudios } from "@/lib/Studio-api"
import { StudioCard } from "../Studio card/Studio-card"

type SimilarStudiosProps = {
  currentId: number | string
  category: string
}

/** Up to three published studios, matching the current category first. */
export function SimilarStudios({ currentId, category }: SimilarStudiosProps) {
  const [state, setState] = React.useState<
    | { status: "loading" }
    | { status: "ready"; studios: Awaited<ReturnType<typeof getPublicStudios>> }
    | { status: "error" }
  >({ status: "loading" })

  React.useEffect(() => {
    const controller = new AbortController()
    getPublicStudios(controller.signal)
      .then((studios) => {
        if (!controller.signal.aborted) {
          setState({ status: "ready", studios })
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" })
      })

    return () => controller.abort()
  }, [])

  const others =
    state.status === "ready"
      ? state.studios.filter((studio) => studio.id !== currentId)
      : []
  const similar = [
    ...others.filter((studio) => studio.category === category),
    ...others.filter((studio) => studio.category !== category),
  ].slice(0, 3)

  if (state.status === "ready" && similar.length === 0) return null

  return (
    <section className="mt-20">
      <Reveal className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-primary" />
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Similar Studios
          </h2>
        </div>
        <Link
          href="/explore-studio"
          className="btn-alive text-xs font-medium text-primary transition-opacity hover:opacity-80"
        >
          View more
        </Link>
      </Reveal>

      <Reveal
        delay={120}
        className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {state.status === "loading" ? (
          [0, 1, 2].map((item) => (
            <div key={item} aria-hidden="true" className="space-y-4">
              <Skeleton className="aspect-[4/3] rounded-2xl motion-reduce:animate-none" />
              <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-1/2 motion-reduce:animate-none" />
            </div>
          ))
        ) : state.status === "error" ? (
          <p role="alert" className="col-span-full text-xs text-destructive">
            Similar studios could not be loaded.
          </p>
        ) : (
          similar.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))
        )}
      </Reveal>
    </section>
  )
}
