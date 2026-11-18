import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BookingStatus, UserBooking } from "@/lib/Dashboard-data"
import { cn, formatTaka } from "@/lib/utils"

export const bookingStatusClass: Record<BookingStatus, string> = {
  Confirmed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Rejected: "bg-destructive/15 text-destructive",
  Completed: "bg-muted text-foreground",
  Cancelled: "bg-destructive/15 text-destructive",
}

/** Only upcoming bookings can still be cancelled. */
export const isCancellable = (status: BookingStatus) =>
  status === "Confirmed" || status === "Pending"

type BookingRowProps = {
  booking: UserBooking
  onView: (booking: UserBooking) => void
  onCancel: (booking: UserBooking) => void
}

/** One booking in the My Bookings list. Stacks on mobile, single row from `sm`. */
export function BookingRow({ booking, onView, onCancel }: BookingRowProps) {
  return (
    <li className="group flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:py-5">
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
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
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
                bookingStatusClass[booking.status]
              )}
            >
              {booking.status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{booking.when}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            #{booking.id} · {booking.guests} guests ·{" "}
            <span className="font-bold text-foreground">
              {formatTaka(booking.total)}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:justify-end">
        {isCancellable(booking.status) && (
          <button
            type="button"
            onClick={() => onCancel(booking)}
            className="rounded text-[11px] font-medium text-destructive underline-offset-4 transition-opacity outline-none hover:underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Cancel
          </button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => onView(booking)}
          className="btn-alive h-8 rounded-lg px-3 text-[11px] font-semibold"
        >
          View Details
        </Button>
      </div>
    </li>
  )
}
