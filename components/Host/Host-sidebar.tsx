"use client"

import { DashboardSidebar } from "@/components/Dashboard/Dashboard-sidebar"
import { hostNav, hostSwitchLink } from "@/lib/Host-data"

/** Host dashboard sidebar: the shared account sidebar with host links. */
export function HostSidebar() {
  return <DashboardSidebar nav={hostNav} switchLink={hostSwitchLink} />
}
