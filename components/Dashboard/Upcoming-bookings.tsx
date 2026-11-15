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
import { upcomingBookings, type DashboardBooking } from "@/lib/Dashboard-data"
import { cn } from "@/lib/utils"

const statusClass: Record<DashboardBooking["status"], string> = {
  Confirmed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
}

export function UpcomingBookings() {
  const [bookings, setBookings] = React.useState(upcomingBookings)
  const [target, setTarget] = React.useState<DashboardBooking | null>(null)

  function confirmCancel() {
    // TODO: call your cancel-booking API
    setBookings((list) => list.filter((b) => b.id !== target?.id))
    setTarget(null)
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

      {bookings.length === 0 ? (
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
                  <p className="mt-1 text-xs text-muted-foreground">{booking.when}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    #{booking.id} · {booking.guests} guests ·{" "}
                    <span className="font-bold text-foreground">${booking.total}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setTarget(booking)}
                  className="rounded text-[11px] font-medium text-destructive underline-offset-4 outline-none transition-opacity hover:underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
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

      <AlertDialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              {target?.studio} on {target?.when.split(" · ")[0]} will be cancelled.
              This can&apos;t be undone.
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