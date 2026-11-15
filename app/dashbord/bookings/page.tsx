import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { BookingsHeader } from "@/components/Dashboard/Bookings header/Bookings-header"
import { BookingsList } from "@/components/Dashboard/Bookings header/Bookings-list"


export const metadata: Metadata = {
  title: "My Bookings — SetSpace",
  description: "View, manage and cancel your studio bookings on SetSpace.",
}

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <Reveal>
        <BookingsHeader />
      </Reveal>
      <Reveal delay={80}>
        <BookingsList />
      </Reveal>
    </div>
  )
}