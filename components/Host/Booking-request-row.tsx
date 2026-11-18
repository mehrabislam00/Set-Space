import React from "react"
import { LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookingStatusBadge from "@/components/Host/Booking-status-badge"
import type { BookingRequest, BookingStatus } from "@/lib/Booking-requests-data"
import { formatTaka } from "@/lib/utils"

interface BookingRequestRowProps {
  booking: BookingRequest
  onStatusChange: (bookingId: string, status: BookingStatus) => void
  onViewDetails: () => void
  isUpdating?: boolean
  updatingStatus?: BookingStatus | null
}

const BookingRequestRow = ({
  booking,
  onStatusChange,
  onViewDetails,
  isUpdating = false,
  updatingStatus = null,
}: BookingRequestRowProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 md:p-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={booking.image}
        alt={booking.studioName}
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold">{booking.studioName}</h3>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {booking.date} · {booking.time} · {booking.durationHours}h
        </p>
        <p className="text-sm text-muted-foreground">
          Renter:{" "}
          <span className="font-semibold text-foreground">
            {booking.renter}
          </span>{" "}
          · #{booking.id} · {booking.guests} guests ·{" "}
          <span className="font-semibold text-foreground">
            {formatTaka(booking.total)}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {booking.status === "Pending" && (
          <>
            <Button
              size="sm"
              disabled={isUpdating}
              onClick={() => onStatusChange(booking.id, "Confirmed")}
            >
              {isUpdating && updatingStatus === "Confirmed" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                "Accept"
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={() => onStatusChange(booking.id, "Rejected")}
            >
              {isUpdating && updatingStatus === "Rejected" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                "Reject"
              )}
            </Button>
          </>
        )}
        {booking.status === "Confirmed" && (
          <Button
            size="sm"
            variant="outline"
            disabled={isUpdating}
            onClick={() => onStatusChange(booking.id, "Completed")}
          >
            {isUpdating && updatingStatus === "Completed" ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              "Mark Completed"
            )}
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          disabled={isUpdating}
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </div>
    </div>
  )
}

export default BookingRequestRow
