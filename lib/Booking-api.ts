import { format } from "date-fns"

import studioPhoto from "@/assets/studio-photo.jpg"
import type { BookingRequest } from "@/lib/Booking-requests-data"
import type { DashboardBooking, UserBooking } from "@/lib/Dashboard-data"
import {
  getStudioImageUrl,
  type MarketplaceBooking,
} from "@/lib/Marketplace-api"

function dateLabel(value: string) {
  return format(new Date(`${value}T12:00:00`), "EEE, MMM d, yyyy")
}

function timeLabel(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  return format(new Date(2000, 0, 1, hours, minutes), "h:mm a")
}

function requestedDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toISOString().slice(0, 10)
}

export function getDhakaCalendarDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  )
  return `${values.year}-${values.month}-${values.day}`
}

function bookingImage(booking: MarketplaceBooking) {
  return getStudioImageUrl(booking.studioImage) ?? studioPhoto.src
}

function bookingWhen(booking: MarketplaceBooking) {
  return `${dateLabel(booking.bookingDate)} · ${timeLabel(
    booking.startTime
  )} – ${timeLabel(booking.endTime)} · ${booking.durationHours}h`
}

export function toUserBooking(booking: MarketplaceBooking): UserBooking {
  return {
    id: booking.id,
    studioId: booking.studioId,
    studio: booking.studioName,
    status: booking.status,
    when: bookingWhen(booking),
    guests: booking.guests,
    total: booking.total,
    image: bookingImage(booking),
    location: booking.studioLocation,
    host: booking.hostName,
    requested: requestedDate(booking.createdAt),
  }
}

export function toHostBookingRequest(
  booking: MarketplaceBooking
): BookingRequest {
  return {
    id: booking.id,
    studioId: booking.studioId,
    studioName: booking.studioName,
    studioLocation: booking.studioLocation,
    image: bookingImage(booking),
    renter: booking.renterName,
    date: dateLabel(booking.bookingDate),
    time: `${timeLabel(booking.startTime)} – ${timeLabel(booking.endTime)}`,
    durationHours: booking.durationHours,
    guests: booking.guests,
    total: booking.total,
    status: booking.status,
    requestedOn: requestedDate(booking.createdAt),
  }
}

export function toUpcomingDashboardBooking(
  booking: MarketplaceBooking
): DashboardBooking | null {
  if (booking.status !== "Pending" && booking.status !== "Confirmed") {
    return null
  }

  const userBooking = toUserBooking(booking)
  return {
    id: userBooking.id,
    studio: userBooking.studio,
    status: booking.status,
    when: userBooking.when,
    guests: userBooking.guests,
    total: userBooking.total,
    image: userBooking.image,
  }
}
