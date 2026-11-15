"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

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
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { hostRequests, type HostRequest } from "@/lib/Host-data"
import { cn } from "@/lib/utils"

export function PendingRequests() {
  const [requests, setRequests] = React.useState(hostRequests)
  const [target, setTarget] = React.useState<HostRequest | null>(null)

  // TODO: replace both handlers with API calls
  const remove = (id: string) =>
    setRequests((list) => list.filter((r) => r.id !== id))

  function confirmReject() {
    if (target) remove(target.id)
    setTarget(null)
  }

  return (
    <section aria-labelledby="pending-heading">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="pending-heading"
          className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
        >
          Pending requests
        </h2>
        <Link
          href="/host/bookings-request"
          className="group flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-80 sm:text-sm"
        >
          View All
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="font-heading text-base font-bold text-foreground">
            No pending requests
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            New booking requests for your studios will show up here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex flex-col gap-4 p-4 transition-colors duration-300 hover:bg-muted/40 sm:p-5 lg:flex-row lg:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-16 w-22 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={request.image}
                    alt={request.studio}
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-foreground sm:text-base">
                      {request.studio}
                    </h3>
                    <Badge className="h-5 border-0 bg-warning/15 text-[10px] font-medium text-warning">
                      Pending
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {request.when}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Renter:{" "}
                    <span className="font-bold text-foreground">
                      {request.renter}
                    </span>{" "}
                    · #{request.id} · {request.guests} guests ·{" "}
                    <span className="font-bold text-foreground">
                      ${request.total}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Button
                  type="button"
                  onClick={() => remove(request.id)}
                  className="btn-alive h-8 rounded-lg px-3 text-[11px] font-semibold"
                >
                  Accept
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTarget(request)}
                  className="btn-alive h-8 rounded-lg px-3 text-[11px] font-semibold"
                >
                  Reject
                </Button>
                <Link
                  href="/host/bookings-request"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "btn-alive h-8 rounded-lg px-3 text-[11px] font-semibold"
                  )}
                >
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this request?</AlertDialogTitle>
            <AlertDialogDescription>
              {target?.renter}&apos;s request for {target?.studio} on{" "}
              {target?.when.split(" · ")[0]} will be declined. This can&apos;t
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep request</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmReject}>
              Reject request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}