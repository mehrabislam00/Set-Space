import {
  Briefcase,
  Building2,
  CalendarCheck,
  Clock,
  DollarSign,
  Inbox,
  Plus,
  Settings,
  type LucideIcon,
} from "lucide-react"
import type { StaticImageData } from "next/image"
import studioLoft from "@/assets/studio-loft.jpg"

import type { NavItem } from "@/lib/Dashboard-data"

/* ---------- Host dashboard (/host) ---------- */

export type HostRequest = {
  id: string // booking reference, e.g. "SS-20011"
  studioId: number // id from `exploreStudios` (lib/Site-data.ts)
  studio: string
  when: string
  renter: string
  guests: number
  total: number
  image: StaticImageData
}

// TODO: replace with the host's real booking requests
export const hostRequests: HostRequest[] = [
  {
    id: "SS-20011",
    studioId: 4,
    studio: "Moonlight Loft",
    when: "Sun, Nov 22, 2026 · 10:00 AM – 2:00 PM · 4h",
    renter: "Sarah Kim",
    guests: 6,
    total: 360,
    image: studioLoft,
  },
  {
    id: "SS-20012",
    studioId: 4,
    studio: "Moonlight Loft",
    when: "Wed, Nov 25, 2026 · 3:00 PM – 6:00 PM · 3h",
    renter: "Leo Martins",
    guests: 3,
    total: 270,
    image: studioLoft,
  },
]

export const hostSwitchLink = { label: "Switch to Renting", href: "/dashboard" }

export const hostNav: NavItem[] = [
  { label: "Overview", href: "/host", icon: Briefcase },
  { label: "My Studios", href: "/host/my-studios", icon: Building2 },
  { label: "Add Studio", href: "/host/my-studios/add-studio", icon: Plus },
  {
    label: "Booking Requests",
    href: "/host/bookings-request",
    icon: Inbox,
    badge: hostRequests.length,
  },
  { label: "Settings", href: "/host/settings", icon: Settings },
]

// TODO: replace with the host's real numbers
export const hostStats: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Total Studios", value: "2", icon: Building2 },
  { label: "Total Bookings", value: "5", icon: CalendarCheck },
  { label: "Pending Requests", value: String(hostRequests.length), icon: Clock },
  { label: "Earnings (sample)", value: "$630", icon: DollarSign },
]

/** Sample data for the "Monthly earnings" chart (USD). */
export const monthlyEarnings = [
  { month: "Jun", amount: 480 },
  { month: "Jul", amount: 700 },
  { month: "Aug", amount: 620 },
  { month: "Sep", amount: 1010 },
  { month: "Oct", amount: 830 },
  { month: "Nov", amount: 720 },
]