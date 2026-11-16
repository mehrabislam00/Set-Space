"use client"

import Link from "next/link"
import * as React from "react"

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
import { buttonVariants } from "@/components/ui/button"
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
  const studios = useHostStudios()
  const [target, setTarget] = React.useState<HostStudio | null>(null)

  function toggle(studio: HostStudio, published: boolean) {
    setHostStudioStatus(studio.id, published ? "Published" : "Draft")
  }

  function confirmDelete() {
    if (target) deleteHostStudio(target.id)
    setTarget(null)
  }

  return (
    <div className="space-y-6">
      <Reveal>
        <MyStudiosHeader count={studios.length} />
      </Reveal>

      <Reveal delay={80}>
        {studios.length === 0 ? (
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
              />
            ))}
          </ul>
        )}
      </Reveal>

      <AlertDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
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
            <AlertDialogCancel>Keep studio</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete studio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
