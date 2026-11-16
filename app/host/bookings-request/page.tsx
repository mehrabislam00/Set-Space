import BookingRequestsHeader from '@/components/Host/Booking-requests-header'
import BookingRequestsList from '@/components/Host/Booking-requests-list'
import React from 'react'


const BookingsRequest = () => {
  return (
    <div className='space-y-8'>
      <BookingRequestsHeader />
      <BookingRequestsList />
    </div>
  )
}

export default BookingsRequest