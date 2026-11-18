"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CircleAlert, SearchX } from "lucide-react"

import AddStudioHeader from "@/components/Host/Add-studio-header"
import { StudioForm } from "@/components/Host/Studio-form"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { HostStudio, StudioFormData } from "@/lib/Host-data"
import { MarketplaceApiError } from "@/lib/Marketplace-api"
import { fetchHostStudio, updateHostStudio } from "@/lib/Studio-store"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/toast"

type EditState =
  | { status: "loading" }
  | { status: "ready"; studio: HostStudio }
  | { status: "not-found" }
  | { status: "error"; message: string }

type PendingAction = "save" | "draft" | null

const REDIRECT_DELAY = 900

export function EditStudio({ studioId }: { studioId?: string }) {
  const router = useRouter()
  const [state, setState] = React.useState<EditState>(
    studioId ? { status: "loading" } : { status: "not-found" }
  )
  const [pendingAction, setPendingAction] = React.useState<PendingAction>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  )
  const redirectTimer = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!studioId) return

    let cancelled = false

    fetchHostStudio(studioId)
      .then((studio) => {
        if (cancelled) return
        setState(studio ? { status: "ready", studio } : { status: "not-found" })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "We could not load this studio. Please try again.",
        })
      })

    return () => {
      cancelled = true
    }
  }, [studioId])

  React.useEffect(() => {
    return () => {
      if (redirectTimer.current !== null) {
        window.clearTimeout(redirectTimer.current)
      }
    }
  }, [])

  const studio = state.status === "ready" ? state.studio : null

  function scheduleRedirect() {
    if (redirectTimer.current !== null) {
      window.clearTimeout(redirectTimer.current)
    }
    redirectTimer.current = window.setTimeout(() => {
      router.push("/host/my-studios")
    }, REDIRECT_DELAY)
  }

  async function handleUpdate(data: StudioFormData) {
    if (!studio || pendingAction !== null) return

    setPendingAction("save")
    setSuccessMessage(null)

    try {
      await updateHostStudio(studio.id, data)
      setSuccessMessage("Studio updated successfully.")
      scheduleRedirect()
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
      setPendingAction(null)
    }
  }

  async function handleSaveDraft(data: StudioFormData) {
    if (!studio || pendingAction !== null) return

    setPendingAction("draft")
    setSuccessMessage(null)

    try {
      await updateHostStudio(studio.id, data, { status: "Draft" })
      setSuccessMessage("Draft saved.")
      scheduleRedirect()
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
      setPendingAction(null)
    }
  }

  if (state.status === "loading") {
    return <EditStudioSkeleton />
  }

  if (state.status === "not-found") {
    return (
      <EditStudioState
        icon={<SearchX className="size-8 text-primary" />}
        title="Studio not found"
        description="This listing may have been deleted, or the link is out of date."
      />
    )
  }

  if (state.status === "error") {
    return (
      <EditStudioState
        icon={<CircleAlert className="size-8 text-destructive" />}
        title="Could not load studio"
        description={state.message}
      />
    )
  }

  return (
    <div className="space-y-8">
      <AddStudioHeader
        title={`Edit ${state.studio.name}`}
        description="Changes save to your SetSpace account."
      />
      <StudioForm
        key={state.studio.id}
        initialData={state.studio.details}
        submitLabel="Update Studio"
        pendingAction={pendingAction}
        successMessage={successMessage}
        onSubmit={handleUpdate}
        onSaveDraft={handleSaveDraft}
        onCancel={() => router.push("/host/my-studios")}
      />
    </div>
  )
}

function EditStudioSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-52 max-w-full" />
      </div>

      <div className="space-y-10">
        {[1, 2, 3, 4].map((section) => (
          <section
            key={section}
            className="grid gap-6 border-t border-border pt-10 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr] md:gap-10"
          >
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </section>
        ))}
      </div>

      <p className="sr-only">Loading studio…</p>
    </div>
  )
}

function EditStudioState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
        {icon}
        <h1 className="mt-2 font-heading text-lg font-bold text-foreground">
          {title}
        </h1>
        <p className="text-sm text-balance text-muted-foreground">
          {description}
        </p>
        <Link
          href="/host/my-studios"
          className={cn(buttonVariants({ size: "lg" }), "mt-4")}
        >
          Back to My Studios
        </Link>
      </div>
    </div>
  )
}
