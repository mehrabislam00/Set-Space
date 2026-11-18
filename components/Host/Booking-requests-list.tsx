"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import BookingRequestDialog from "@/components/Host/Booking-request-dialog"
import BookingRequestRow from "@/components/Host/Booking-request-row"
import BookingRequestsTabs from "@/components/Host/Booking-requests-tabs"
import { toast } from "@/components/ui/toast"
import {
  getBookings,
  MarketplaceApiError,
  updateBookingStatus,
} from "@/lib/Marketplace-api"
import {
  type BookingRequest,
  type BookingStatus,
} from "@/lib/Booking-requests-data"
import { toHostBookingRequest } from "@/lib/Booking-api"

const BookingRequestsList = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [activeTab, setActiveTab] = useState<"All" | BookingStatus>("All")
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState<Error | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<BookingStatus | null>(
    null
  )
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getBookings("host", controller.signal)
      .then((records) => {
        setBookings(records.map(toHostBookingRequest))
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return
        setLoadingError(
          error instanceof Error
            ? error
            : new Error("Could not load booking requests.")
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  const filteredBookings = useMemo(
    () =>
      activeTab === "All"
        ? bookings
        : bookings.filter((booking) => booking.status === activeTab),
    [bookings, activeTab]
  )

  const handleStatusChange = async (
    bookingId: string,
    status: BookingStatus
  ) => {
    if (updatingId) return
    setUpdatingId(bookingId)
    setUpdatingStatus(status)
    try {
      const updated = toHostBookingRequest(
        await updateBookingStatus(bookingId, status)
      )
      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === bookingId ? updated : booking
        )
      )
      setSelectedBooking((previous) =>
        previous?.id === bookingId ? updated : previous
      )
      toast.add({
        title:
          status === "Confirmed"
            ? "Booking confirmed"
            : status === "Rejected"
              ? "Booking request declined"
              : "Booking marked complete",
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
      setUpdatingId(null)
      setUpdatingStatus(null)
    }
  }

  if (loading) {
    return (
      <div
        aria-label="Loading booking requests"
        aria-busy="true"
        className="space-y-4"
      >
        <div className="skeleton-pulse h-10 border-b border-border bg-muted/50" />
        <div className="skeleton-pulse h-48 rounded-2xl border border-border bg-card" />
      </div>
    )
  }

  if (loadingError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
      >
        {loadingError instanceof MarketplaceApiError &&
          loadingError.status === 401 && (
            <Link href="/login" className="mt-2 inline-block underline">
              Sign in
            </Link>
          )}
        <p>{loadingError.message}</p>
        <button
          type="button"
          className="ml-3 font-semibold underline underline-offset-2"
          onClick={() => {
            setLoading(true)
            setLoadingError(null)
            setReloadKey((key) => key + 1)
          }}
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BookingRequestsTabs
        bookings={bookings}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingRequestRow
              key={booking.id}
              booking={booking}
              isUpdating={updatingId !== null}
              updatingStatus={updatingId === booking.id ? updatingStatus : null}
              onStatusChange={handleStatusChange}
              onViewDetails={() => setSelectedBooking(booking)}
            />
          ))
        ) : (
          <p className="p-10 text-center text-sm text-muted-foreground">
            {activeTab === "All"
              ? "No booking requests yet."
              : `No ${activeTab.toLowerCase()} bookings.`}
          </p>
        )}
      </div>

      <BookingRequestDialog
        booking={selectedBooking}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null)
        }}
      />
    </div>
  )
}

export default BookingRequestsList
