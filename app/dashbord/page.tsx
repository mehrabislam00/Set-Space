import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { WelcomeBanner } from "@/components/Dashboard/Welcome-banner"
import { StatsCards } from "@/components/Dashboard/Stats-cards"
import { UpcomingBookings } from "@/components/Dashboard/Upcoming-bookings"
import { QuickActions } from "@/components/Dashboard/Quick-actions"
import { RecentlyViewed } from "@/components/Dashboard/Recently-viewed"


export const metadata: Metadata = {
  title: "Dashboard — SetSpace",
  description: "Your bookings, saved studios and account activity on SetSpace.",
}

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <Reveal>
          <WelcomeBanner />
        </Reveal>
        <Reveal delay={80}>
          <StatsCards />
        </Reveal>
      </div>
      <Reveal delay={80}>
        <UpcomingBookings />
      </Reveal>
      <Reveal>
        <QuickActions />
      </Reveal>
      <Reveal>
        <RecentlyViewed />
      </Reveal>
    </div>
  )
}