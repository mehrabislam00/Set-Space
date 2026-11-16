import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import BookingStatusBadge from '@/components/Host/Booking-status-badge'
import { BookingRequest, BookingStatus } from '@/lib/Booking-requests-data'

interface BookingRequestDialogProps {
  booking: BookingRequest | null
  onOpenChange: (open: boolean) => void
  onStatusChange: (bookingId: string, status: BookingStatus) => void
}

const BookingRequestDialog = ({
  booking,
  onOpenChange,
}: BookingRequestDialogProps) => {
  const router = useRouter()

  const details = booking
    ? ([
        { label: 'Status', value: <BookingStatusBadge status={booking.status} /> },
        { label: 'Date', value: booking.date },
        { label: 'Time', value: booking.time },
        { label: 'Duration', value: `${booking.durationHours} hours` },
        { label: 'Guests', value: booking.guests },
        { label: 'Renter', value: booking.renter },
        { label: 'Requested', value: booking.requestedOn },
        { label: 'Total', value: `$${booking.total}` },
      ] as { label: string; value: React.ReactNode }[])
    : []

  return (
    <Dialog open={Boolean(booking)} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Booking #{booking?.id}</DialogTitle>
          <DialogDescription>
            {booking?.studioName} · {booking?.studioLocation}
          </DialogDescription>
        </DialogHeader>

        {booking && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={booking.image}
              alt={booking.studioName}
              className='aspect-[4/3] w-full rounded-xl object-cover'
            />

            <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
              {details.map((detail) => (
                <div key={detail.label} className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>{detail.label}</p>
                  <div className='text-sm font-semibold'>{detail.value}</div>
                </div>
              ))}
            </div>

            <div className='mt-2 grid grid-cols-2 gap-3'>
              <Button
                variant='outline'
                onClick={() => {
                  // TODO: wire up to the messaging flow once available
                  console.log('Contacting renter:', booking.renter)
                }}
              >
                Contact Renter
              </Button>
              <Button onClick={() => router.push('/studios')}>View Studio</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BookingRequestDialog