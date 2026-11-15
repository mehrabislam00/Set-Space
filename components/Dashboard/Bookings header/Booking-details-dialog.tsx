import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import type { UserBooking } from "@/lib/Dashboard-data"
import { cn } from "@/lib/utils"
import { bookingStatusClass } from "./Booking-row"

type BookingDetailsDialogProps = {
  booking: UserBooking | undefined
  onClose: () => void
}

/** Read-only summary of one booking, with links to contact the host or view the studio. */
export function BookingDetailsDialog({
  booking,
  onClose,
}: BookingDetailsDialogProps) {
  // "Sat, Nov 28, 2026 · 9:00 AM – 11:00 AM · 2h"
  const [date, time, shortDuration] = booking?.when.split(" · ") ?? []
  const hours = parseInt(shortDuration ?? "", 10)
  const duration = Number.isNaN(hours)
    ? shortDuration
    : `${hours} ${hours === 1 ? "hour" : "hours"}`

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-4 rounded-2xl p-5 sm:max-w-md sm:p-6">
        {booking && (
          <>
            <div className="pr-6">
              <DialogTitle className="font-heading text-lg font-bold text-foreground">
                Booking #{booking.id}
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs text-muted-foreground">
                {booking.studio} · {booking.location}
              </DialogDescription>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
              <Image
                src={booking.image}
                alt={booking.studio}
                fill
                sizes="(min-width: 640px) 400px, 100vw"
                className="object-cover"
              />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Detail label="Status">
                <Badge
                  className={cn(
                    "h-5 border-0 text-[10px] font-medium",
                    bookingStatusClass[booking.status]
                  )}
                >
                  {booking.status}
                </Badge>
              </Detail>
              <Detail label="Date">{date}</Detail>
              <Detail label="Time">{time}</Detail>
              <Detail label="Duration">{duration}</Detail>
              <Detail label="Guests">{booking.guests}</Detail>
              <Detail label="Host">{booking.host}</Detail>
              <Detail label="Requested">{booking.requested}</Detail>
              <Detail label="Total">${booking.total}</Detail>
            </dl>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "btn-alive"
                )}
              >
                Contact Host
              </Link>
              <Link
                href={`/explore-studio/${booking.studioId}`}
                className={cn(buttonVariants({ size: "lg" }), "btn-alive")}
              >
                View Studio
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Detail({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">{children}</dd>
    </div>
  )
}