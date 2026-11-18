"use client"

import Link from "next/link"
import * as React from "react"
import { AlertCircle, Loader2 } from "lucide-react"

import { Reveal } from "@/components/Animation/Reveal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { MarketplaceApiError } from "@/lib/Marketplace-api"
import type { HostStudio } from "@/lib/Host-data"
import {
  deleteHostStudio,
  setHostStudioStatus,
  useHostStudios,
} from "@/lib/Studio-store"
import { cn } from "@/lib/utils"
import { MyStudiosHeader } from "./My-studios-header"
import { StudioRow } from "./Studio-row"

/** Header + listings for /host/my-studios, with publish toggle and delete confirmation. */
export function MyStudios() {
  const { studios, status, error, retry } = useHostStudios()
  const [target, setTarget] = React.useState<HostStudio | null>(null)
  const [pendingStudioId, setPendingStudioId] = React.useState<string | null>(
    null
  )
  const [deleting, setDeleting] = React.useState(false)

  async function toggle(studio: HostStudio, published: boolean) {
    setPendingStudioId(studio.id)
    try {
      await setHostStudioStatus(studio.id, published ? "Published" : "Draft")
      toast.add({
        title: published ? "Studio published" : "Studio moved to drafts",
        type: "success",
      })
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } finally {
      setPendingStudioId(null)
    }
  }

  async function confirmDelete() {
    if (!target || deleting) return

    setDeleting(true)
    try {
      await deleteHostStudio(target.id)
      setTarget(null)
      toast.add({
        title: "Studio deleted",
        description: "The listing was removed from your studios.",
        type: "success",
      })
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Reveal>
        <MyStudiosHeader
          count={studios.length}
          loading={status === "loading"}
        />
      </Reveal>

      <Reveal delay={80}>
        {status === "loading" ? (
          <StudioListSkeleton />
        ) : status === "error" ? (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
          >
            <AlertCircle className="mx-auto size-7 text-destructive" />
            <p className="mt-3 text-sm text-foreground">
              {error || "Could not load your studios."}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={retry}
            >
              Try again
            </Button>
          </div>
        ) : status === "unauthenticated" ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="font-heading text-base font-bold text-foreground">
              Sign in to manage your studios
            </p>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "lg" }), "btn-alive mt-5")}
            >
              Sign In
            </Link>
          </div>
        ) : studios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="font-heading text-base font-bold text-foreground">
              No studios yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              List your first studio and start receiving booking requests.
            </p>
            <Link
              href="/host/my-studios/add-studio"
              className={cn(buttonVariants({ size: "lg" }), "btn-alive mt-5")}
            >
              Add Studio
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card px-4 sm:px-5">
            {studios.map((studio) => (
              <StudioRow
                key={studio.id}
                studio={studio}
                onToggle={toggle}
                onDelete={setTarget}
                pending={pendingStudioId === studio.id}
              />
            ))}
          </ul>
        )}
      </Reveal>

      <AlertDialog
        open={!!target}
        onOpenChange={(open) => !open && !deleting && setTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this studio?</AlertDialogTitle>
            <AlertDialogDescription>
              {target?.name} will be removed from your listings. This can&apos;t
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Keep studio
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(event) => {
                event.preventDefault()
                void confirmDelete()
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              {deleting ? "Deleting…" : "Delete studio"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StudioListSkeleton() {
  return (
    <div
      aria-busy="true"
      className="divide-y divide-border rounded-2xl border border-border bg-card px-4 sm:px-5"
    >
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-4 py-4 sm:py-5">
          <Skeleton className="size-16 shrink-0 rounded-xl motion-reduce:animate-none" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 max-w-full motion-reduce:animate-none" />
            <Skeleton className="h-3 w-56 max-w-full motion-reduce:animate-none" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  )
}
