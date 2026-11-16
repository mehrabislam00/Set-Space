import React from 'react'
import { cn } from '@/lib/utils'
import { BOOKING_STATUS_TABS, BookingRequest, BookingStatus } from '@/lib/Booking-requests-data'

interface BookingRequestsTabsProps {
  bookings: BookingRequest[]
  activeTab: 'All' | BookingStatus
  onTabChange: (tab: 'All' | BookingStatus) => void
}

const BookingRequestsTabs = ({ bookings, activeTab, onTabChange }: BookingRequestsTabsProps) => {
  const getCount = (tab: 'All' | BookingStatus) =>
    tab === 'All' ? bookings.length : bookings.filter((booking) => booking.status === tab).length

  return (
    <div className='flex gap-6 overflow-x-auto border-b border-border'>
      {BOOKING_STATUS_TABS.map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            type='button'
            onClick={() => onTabChange(tab)}
            className={cn(
              'relative whitespace-nowrap pb-3 text-sm transition-colors',
              isActive
                ? 'font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}{' '}
            <span className={cn(isActive ? 'text-muted-foreground' : 'text-muted-foreground/70')}>
              {getCount(tab)}
            </span>
            {isActive && <span className='absolute inset-x-0 -bottom-px h-0.5 bg-primary' />}
          </button>
        )
      })}
    </div>
  )
}

export default BookingRequestsTabs