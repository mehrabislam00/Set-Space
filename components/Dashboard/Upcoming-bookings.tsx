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
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  getBookings,
  MarketplaceApiError,
  updateBookingStatus,
} from "@/lib/Marketplace-api"
import {
  getDhakaCalendarDate,
  toUpcomingDashboardBooking,
} from "@/lib/Booking-api"
import type { DashboardBooking } from "@/lib/Dashboard-data"
import { cn, formatTaka } from "@/lib/utils"

const statusClass: Record<DashboardBooking["status"], string> = {
  Confirmed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
}

export function UpcomingBookings() {
  const [bookings, setBookings] = React.useState<DashboardBooking[]>([])
  const [target, setTarget] = React.useState<DashboardBooking | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [cancelling, setCancelling] = React.useState(false)
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(() => {
    const controller = new AbortController()

    getBookings("renter", controller.signal)
      .then((records) => {
        setBookings(
          records
            .filter(
              (booking) =>
                booking.bookingDate >= getDhakaCalendarDate() &&
                (booking.status === "Pending" || booking.status === "Confirmed")
            )
            .sort((left, right) =>
              `${left.bookingDate}T${left.startTime}`.localeCompare(
                `${right.bookingDate}T${right.startTime}`
              )
            )
            .map(toUpcomingDashboardBooking)
            .filter((booking): booking is DashboardBooking => booking !== null)
            .slice(0, 3)
        )
      })
      .catch((loadError: unknown) => {
        if (loadError instanceof Error && loadError.name === "AbortError")
          return
        setError(
          loadError instanceof Error
            ? loadError
            : new Error("Could not load upcoming bookings.")
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  async function confirmCancel() {
    if (!target || cancelling) return

    setCancelling(true)
    try {
      await updateBookingStatus(target.id, "Cancelled")
      setBookings((list) => list.filter((booking) => booking.id !== target.id))
      setTarget(null)
      toast.add({
        title: "Booking cancelled",
        description: "Your booking request has been cancelled.",
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
      setCancelling(false)
    }
  }

  return (
    <section aria-labelledby="upcoming-heading">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="upcoming-heading"
          className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
        >
          Upcoming Bookings
        </h2>
        <Link
          href="/dashboard/bookings"
          className="group flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-80 sm:text-sm"
        >
          View All
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
        </Link>
      </div>

      {loading ? (
        <div
          aria-label="Loading upcoming bookings"
          aria-busy="true"
          className="skeleton-pulse mt-6 h-48 rounded-2xl border border-border bg-card"
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
      ) : bookings.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="font-heading text-base font-bold text-foreground">
            No upcoming bookings
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Find a studio and book your next session.
          </p>
          <Link
            href="/explore-studio"
            className={cn(buttonVariants({ size: "lg" }), "btn-alive mt-5")}
          >
            Explore Studios
          </Link>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="flex flex-col gap-4 p-4 transition-colors duration-300 hover:bg-muted/40 sm:flex-row sm:items-center sm:p-5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-16 w-22 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={booking.image}
                    alt={booking.studio}
                    fill
                    unoptimized={
                      typeof booking.image === "string" &&
                      !booking.image.startsWith("/_next/static/")
                    }
                    sizes="88px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-foreground sm:text-base">
                      {booking.studio}
                    </h3>
                    <Badge
                      className={cn(
                        "h-5 border-0 text-[10px] font-medium",
                        statusClass[booking.status]
                      )}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {booking.when}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    #{booking.id} · {booking.guests} guests ·{" "}
                    <span className="font-bold text-foreground">
                      {formatTaka(booking.total)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setTarget(booking)}
                  className="rounded text-[11px] font-medium text-destructive underline-offset-4 transition-opacity outline-none hover:underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Cancel
                </button>
                <Link
                  href="/dashboard/bookings"
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
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              {target?.studio} on {target?.when.split(" · ")[0]} will be
              cancelled. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={cancelling}
              onClick={confirmCancel}
            >
              {cancelling ? "Cancelling…" : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
