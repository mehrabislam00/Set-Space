import React from 'react'
import { cn } from '@/lib/utils'
import { BookingStatus } from '@/lib/Booking-requests-data'

const STATUS_BADGE_CLASSES: Record<BookingStatus, string> = {
  Pending: 'bg-primary/15 text-primary',
  Confirmed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Rejected: 'bg-red-500/15 text-red-600 dark:text-red-400',
  Completed: 'bg-muted text-muted-foreground',
  Cancelled: 'bg-muted text-muted-foreground',
}

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

const BookingStatusBadge = ({ status, className }: BookingStatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        STATUS_BADGE_CLASSES[status],
        className
      )}
    >
      {status}
    </span>
  )
}

export default BookingStatusBadge