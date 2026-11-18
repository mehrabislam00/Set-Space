"use client"

import Link from "next/link"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getPublicStudios } from "@/lib/Studio-api"
import { Container } from "../../Container/Container"
import { StudioCard } from "../../Studio card/Studio-card"
import { Reveal } from "@/components/Animation/Reveal"

export function FeaturedStudios() {
  const [state, setState] = React.useState<
    | { status: "loading" }
    | { status: "ready"; studios: Awaited<ReturnType<typeof getPublicStudios>> }
    | { status: "error"; message: string }
  >({ status: "loading" })
  const [retryCount, setRetryCount] = React.useState(0)

  React.useEffect(() => {
    const controller = new AbortController()
    getPublicStudios(controller.signal)
      .then((studios) => {
        if (!controller.signal.aborted) {
          setState({ status: "ready", studios })
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Could not load featured studios.",
        })
      })

    return () => controller.abort()
  }, [retryCount])

  const studios =
    state.status === "ready"
      ? state.studios.filter((studio) => studio.featured)
      : []
  const listedStudios =
    studios.length > 0
      ? studios.slice(0, 6)
      : state.status === "ready"
        ? state.studios.slice(0, 6)
        : []

  return (
    <section className="bg-background py-16">
      <Container>
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
              {studios.length > 0 ? "Hand-picked this week" : "New additions"}
            </p>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-primary" />
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Featured Studios
              </h2>
            </div>
          </div>

          <Link
            href="/explore-studio"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "btn-alive rounded-full text-xs",
            })}
          >
            See all
          </Link>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {state.status === "loading" ? (
            <FeaturedSkeletonGrid />
          ) : state.status === "error" ? (
            <div
              role="alert"
              className="col-span-full rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
            >
              <p className="text-sm text-foreground">{state.message}</p>
              <button
                type="button"
                onClick={() => {
                  setState({ status: "loading" })
                  setRetryCount((count) => count + 1)
                }}
                className="mt-3 text-xs font-semibold text-primary underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          ) : listedStudios.length > 0 ? (
            listedStudios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                New studio listings will appear here.
              </p>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  )
}

function FeaturedSkeletonGrid() {
  return (
    <>
      {[0, 1, 2].map((item) => (
        <div key={item} aria-hidden="true" className="space-y-4">
          <Skeleton className="aspect-[4/3] rounded-2xl motion-reduce:animate-none" />
          <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
          <Skeleton className="h-3 w-1/2 motion-reduce:animate-none" />
        </div>
      ))}
    </>
  )
}
