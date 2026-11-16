"use client"

import React, { useMemo, useState } from 'react'
import BookingRequestDialog from '@/components/Host/Booking-request-dialog'
import BookingRequestRow from '@/components/Host/Booking-request-row'
import BookingRequestsTabs from '@/components/Host/Booking-requests-tabs'
import { BOOKING_REQUESTS, BookingRequest, BookingStatus } from '@/lib/Booking-requests-data'

const BookingRequestsList = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>(BOOKING_REQUESTS)
  const [activeTab, setActiveTab] = useState<'All' | BookingStatus>('All')
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null)

  const filteredBookings = useMemo(
    () =>
      activeTab === 'All'
        ? bookings
        : bookings.filter((booking) => booking.status === activeTab),
    [bookings, activeTab]
  )

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    // TODO: wire up to the bookings API once the endpoints are available
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking))
    )
    setSelectedBooking((prev) => (prev && prev.id === bookingId ? { ...prev, status } : prev))
  }

  return (
    <div className='space-y-4'>
      <BookingRequestsTabs bookings={bookings} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className='divide-y divide-border rounded-2xl border border-border bg-card'>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingRequestRow
              key={booking.id}
              booking={booking}
              onStatusChange={handleStatusChange}
              onViewDetails={() => setSelectedBooking(booking)}
            />
          ))
        ) : (
          <p className='p-10 text-center text-sm text-muted-foreground'>
            No bookings in this category.
          </p>
        )}
      </div>

      <BookingRequestDialog
        booking={selectedBooking}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null)
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}

export default BookingRequestsList