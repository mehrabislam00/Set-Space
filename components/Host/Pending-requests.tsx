"use client"

import { ArrowRight, LoaderCircle } from "lucide-react"
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
import { toast } from "@/components/ui/toast"
import { toHostBookingRequest } from "@/lib/Booking-api"
import {
  type BookingRequest,
  type BookingStatus,
} from "@/lib/Booking-requests-data"
import {
  getBookings,
  MarketplaceApiError,
  updateBookingStatus,
} from "@/lib/Marketplace-api"
import { cn, formatTaka } from "@/lib/utils"

type PendingRequest = Pick<
  BookingRequest,
  | "id"
  | "studioName"
  | "image"
  | "date"
  | "time"
  | "renter"
  | "guests"
  | "total"
>

function toPendingRequest(booking: BookingRequest): PendingRequest {
  return {
    id: booking.id,
    studioName: booking.studioName,
    image: booking.image,
    date: booking.date,
    time: booking.time,
    renter: booking.renter,
    guests: booking.guests,
    total: booking.total,
  }
}

export function PendingRequests() {
  const [requests, setRequests] = React.useState<PendingRequest[]>([])
  const [target, setTarget] = React.useState<PendingRequest | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(() => {
    const controller = new AbortController()

    getBookings("host", controller.signal)
      .then((bookings) => {
        setRequests(
          bookings
            .filter((booking) => booking.status === "Pending")
            .map((booking) => toPendingRequest(toHostBookingRequest(booking)))
        )
      })
      .catch((loadError: unknown) => {
        if (loadError instanceof Error && loadError.name === "AbortError")
          return
        setError(
          loadError instanceof Error
            ? loadError
            : new Error("Could not load pending booking requests.")
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  async function changeStatus(id: string, status: BookingStatus) {
    if (updatingId) return
    setUpdatingId(id)
    try {
      await updateBookingStatus(id, status)
      setRequests((current) => current.filter((request) => request.id !== id))
      setTarget(null)
      toast.add({
        title:
          status === "Confirmed"
            ? "Booking confirmed"
            : "Booking request declined",
        type: "success",
      })
    } catch (requestError) {
      if (!(requestError instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } finally {
      setUpdatingId(null)
    }
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

      {loading ? (
        <div
          aria-label="Loading pending requests"
          aria-busy="true"
          className="skeleton-pulse mt-6 h-40 rounded-2xl border border-border bg-card"
        />
      ) : error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
        >
          <p>{error.message}</p>
          {error instanceof MarketplaceApiError && error.status === 401 && (
            <Link href="/login" className="mr-3 underline">
              Sign in
            </Link>
          )}
          <button
            type="button"
            className="font-semibold underline underline-offset-2"
            onClick={() => {
              setLoading(true)
              setError(null)
              setReloadKey((key) => key + 1)
            }}
          >
            Try again
          </button>
        </div>
      ) : requests.length === 0 ? (
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
                    alt={request.studioName}
                    fill
                    unoptimized={!request.image.startsWith("/_next/static/")}
                    sizes="88px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-foreground sm:text-base">
                      {request.studioName}
                    </h3>
                    <Badge className="h-5 border-0 bg-warning/15 text-[10px] font-medium text-warning">
                      Pending
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {request.date} · {request.time}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Renter:{" "}
                    <span className="font-bold text-foreground">
                      {request.renter}
                    </span>{" "}
                    · #{request.id} · {request.guests} guests ·{" "}
                    <span className="font-bold text-foreground">
                      {formatTaka(request.total)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Button
                  type="button"
                  disabled={updatingId !== null}
                  onClick={() => changeStatus(request.id, "Confirmed")}
                  className="btn-alive h-8 rounded-lg px-3 text-[11px] font-semibold"
                >
                  {updatingId === request.id ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    "Accept"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={updatingId !== null}
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

      <AlertDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this request?</AlertDialogTitle>
            <AlertDialogDescription>
              {target?.renter}&apos;s request for {target?.studioName} on{" "}
              {target?.date} will be declined. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep request</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={updatingId !== null}
              onClick={() => {
                if (target) void changeStatus(target.id, "Rejected")
              }}
            >
              Reject request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
