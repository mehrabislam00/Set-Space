import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { EarningsChart } from "@/components/Host/Earnings-chart"
import { HostHeader } from "@/components/Host/Host-header"
import { HostDashboardStatsProvider } from "@/components/Host/Host-dashboard-stats-provider"
import { HostStats } from "@/components/Host/Host-stats"
import { PendingRequests } from "@/components/Host/Pending-requests"

export const metadata: Metadata = {
  title: "Host Dashboard — SetSpace",
  description: "Your studios, booking requests and earnings on SetSpace.",
}

export default function HostPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <Reveal>
          <HostHeader />
        </Reveal>
        <HostDashboardStatsProvider>
          <Reveal delay={80}>
            <HostStats />
          </Reveal>
          <Reveal delay={80}>
            <EarningsChart />
          </Reveal>
        </HostDashboardStatsProvider>
      </div>
      <Reveal>
        <PendingRequests />
      </Reveal>
    </div>
  )
}
