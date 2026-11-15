import {
  Bell,
  CalendarCheck,
  CalendarDays,
  Compass,
  Heart,
  LayoutDashboard,
  Settings,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import type { StaticImageData } from "next/image"
import studioPhoto from "@/assets/studio-photo.jpg"
import studioPodcast from "@/assets/studio-podcast.jpg"

/* ---------- User dashboard (/dashboard) ---------- */

// TODO: replace with the signed-in user
export const dashboardUser = {
  name: "Alex Carter",
  email: "alex@example.com",
  initials: "AC",
}

export const dashboardNav: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
  { label: "Saved Studios", href: "/dashboard/wishlist", icon: Heart },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export const dashboardStats: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Total Bookings", value: "5", icon: CalendarDays },
  { label: "Saved Studios", value: "8", icon: Heart },
  { label: "Upcoming", value: "2", icon: CalendarCheck },
  { label: "Total Spent", value: "$770", icon: Wallet },
]

export type DashboardBooking = {
  id: string // booking reference, e.g. "SS-10482"
  studio: string
  status: "Confirmed" | "Pending"
  when: string
  guests: number
  total: number
  image: StaticImageData
}

export const upcomingBookings: DashboardBooking[] = [
  {
    id: "SS-10482",
    studio: "The Aurora Studio",
    status: "Confirmed",
    when: "Sat, Nov 28, 2026 · 9:00 AM – 11:00 AM · 2h",
    guests: 4,
    total: 160,
    image: studioPhoto,
  },
  {
    id: "SS-10517",
    studio: "Echo Podcast Room",
    status: "Pending",
    when: "Fri, Dec 4, 2026 · 2:00 PM – 4:00 PM · 2h",
    guests: 3,
    total: 120,
    image: studioPodcast,
  },
]

export const quickActions: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Explore Studios", href: "/explore-studio", icon: Compass },
  { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
  { label: "Saved Studios", href: "/dashboard/wishlist", icon: Heart },
  { label: "Update Profile", href: "/dashboard/profile", icon: User },
]

/** Ids from `exploreStudios` (lib/Site-data.ts) shown under "Recently viewed". */
export const recentlyViewedIds = [1, 3, 5]