"use client"

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
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toUserBooking } from "@/lib/Booking-api"
import {
  bookingFilters,
  type BookingFilter,
  type UserBooking,
} from "@/lib/Dashboard-data"
import {
  getBookings,
  MarketplaceApiError,
  updateBookingStatus,
} from "@/lib/Marketplace-api"
import { cn } from "@/lib/utils"
import { BookingsHeader } from "./Bookings-header"
import { BookingDetailsDialog } from "./Booking-details-dialog"
import { BookingRow } from "./Booking-row"

function matches(booking: UserBooking, filter: BookingFilter) {
  if (filter === "All") return true
  if (filter === "Upcoming")
    return booking.status === "Confirmed" || booking.status === "Pending"
  return booking.status === filter
}

/** Status tabs + booking list, with cancel confirmation and a details dialog. */
export function BookingsList() {
  const [bookings, setBookings] = React.useState<UserBooking[]>([])
  const [filter, setFilter] = React.useState<BookingFilter>("All")
  const [cancelTarget, setCancelTarget] = React.useState<UserBooking | null>(
    null
  )
  const [viewingId, setViewingId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<Error | null>(null)
  const [cancelling, setCancelling] = React.useState(false)
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(() => {
    const controller = new AbortController()

    getBookings("renter", controller.signal)
      .then((records) => setBookings(records.map(toUserBooking)))
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return
        setLoadError(
          error instanceof Error ? error : new Error("Could not load bookings.")
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  const visible = bookings.filter((booking) => matches(booking, filter))
  const viewing = bookings.find((booking) => booking.id === viewingId)

  async function confirmCancel() {
    if (!cancelTarget || cancelling) return

    setCancelling(true)
    try {
      const updated = await updateBookingStatus(cancelTarget.id, "Cancelled")
      setBookings((list) =>
        list.map((booking) =>
          booking.id === updated.id ? toUserBooking(updated) : booking
        )
      )
      setCancelTarget(null)
      toast.add({
        title: "Booking cancelled",
        description: "Your booking request has been cancelled.",
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
      setCancelling(false)
    }
  }

  return (
    <div className="space-y-6">
      <BookingsHeader total={bookings.length} loading={loading} />

      {loadError ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
        >
          <p>{loadError.message}</p>
          {loadError instanceof MarketplaceApiError &&
            loadError.status === 401 && (
              <Link href="/login" className="mr-3 underline">
                Sign in
              </Link>
            )}
          <button
            type="button"
            className="font-semibold underline underline-offset-2"
            onClick={() => {
              setLoading(true)
              setLoadError(null)
              setReloadKey((key) => key + 1)
            }}
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div
          aria-label="Loading bookings"
          aria-busy="true"
          className="space-y-4"
        >
          <div className="skeleton-pulse h-10 border-b border-border bg-muted/50" />
          <div className="skeleton-pulse h-64 rounded-2xl border border-border bg-card" />
        </div>
      ) : (
        <section aria-label="Bookings" className="space-y-5">
          <div
            role="tablist"
            aria-label="Filter bookings"
            className="-mx-1 flex [scrollbar-width:none] gap-6 overflow-x-auto overflow-y-hidden border-b border-border px-1 [&::-webkit-scrollbar]:hidden"
          >
            {bookingFilters.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={filter === name}
                onClick={() => setFilter(name)}
                className={cn(
                  "border-b-2 px-1 py-3 text-xs font-medium whitespace-nowrap transition-colors duration-300 outline-none focus-visible:text-primary motion-reduce:transition-none",
                  filter === name
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {name}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <p className="font-heading text-base font-bold text-foreground">
                No {filter === "All" ? "" : `${filter.toLowerCase()} `}bookings
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
            <ul
              key={filter}
              role="tabpanel"
              className="stagger-in divide-y divide-border rounded-2xl border border-border bg-card px-4 sm:px-5"
            >
              {visible.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onView={(item) => setViewingId(item.id)}
                  onCancel={setCancelTarget}
                />
              ))}
            </ul>
          )}
        </section>
      )}

      <BookingDetailsDialog
        booking={viewing}
        onClose={() => setViewingId(null)}
      />

      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelTarget?.studio} on {cancelTarget?.when.split(" · ")[0]}{" "}
              will be cancelled. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>
              Keep booking
            </AlertDialogCancel>
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
    </div>
  )
}
