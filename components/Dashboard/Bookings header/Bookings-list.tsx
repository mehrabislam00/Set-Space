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
import {
  allBookings,
  bookingFilters,
  type BookingFilter,
  type UserBooking,
} from "@/lib/Dashboard-data"
import { cn } from "@/lib/utils"
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
  const [bookings, setBookings] = React.useState(allBookings)
  const [filter, setFilter] = React.useState<BookingFilter>("All")
  const [cancelTarget, setCancelTarget] = React.useState<UserBooking | null>(null)
  const [viewingId, setViewingId] = React.useState<string | null>(null)

  const visible = bookings.filter((b) => matches(b, filter))
  const viewing = bookings.find((b) => b.id === viewingId)

  function confirmCancel() {
    // TODO: call your cancel-booking API
    setBookings((list) =>
      list.map((b) =>
        b.id === cancelTarget?.id ? { ...b, status: "Cancelled" as const } : b
      )
    )
    setCancelTarget(null)
  }

  return (
    <section aria-label="Bookings" className="space-y-5">
      {/* Status tabs */}
      <div
        role="tablist"
        aria-label="Filter bookings"
        className="-mx-1 flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {bookingFilters.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={filter === name}
            onClick={() => setFilter(name)}
            className={cn(
              "border-b-2 px-1 py-3 text-xs font-medium whitespace-nowrap outline-none transition-colors duration-300 focus-visible:text-primary motion-reduce:transition-none",
              filter === name
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {name}
          </button>
        ))}
      </div>

      {/* List */}
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
              onView={(b) => setViewingId(b.id)}
              onCancel={setCancelTarget}
            />
          ))}
        </ul>
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
              {cancelTarget?.studio} on {cancelTarget?.when.split(" · ")[0]} will
              be cancelled. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmCancel}>
              Cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}