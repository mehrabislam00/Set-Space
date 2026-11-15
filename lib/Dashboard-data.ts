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
import studioContent from "@/assets/studio-content.jpg"
import studioFilm from "@/assets/studio-film.jpg"
import studioMusic from "@/assets/studio-music.jpg"
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
  { label: "Saved Studios", href: "/dashboard/saved-studios", icon: Heart },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
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
  { label: "Saved Studios", href: "/dashboard/saved-studios", icon: Heart },
  { label: "Update Profile", href: "/dashboard/profile", icon: User },
]

/** Ids from `exploreStudios` (lib/Site-data.ts) shown under "Recently viewed". */
export const recentlyViewedIds = [1, 3, 5]

/* ---------- My Bookings (/dashboard/bookings) ---------- */

export type BookingStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled"

export type UserBooking = Omit<DashboardBooking, "status"> & {
  status: BookingStatus
  studioId: number // id from `exploreStudios`, used for the "View Studio" link
  location: string
  host: string
  requested: string // date the booking was requested, yyyy-mm-dd
}

export const bookingFilters = [
  "All",
  "Upcoming",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const

export type BookingFilter = (typeof bookingFilters)[number]

// TODO: replace with the signed-in user's bookings
export const allBookings: UserBooking[] = [
  {
    id: "SS-10482",
    studioId: 1,
    studio: "The Aurora Studio",
    status: "Confirmed",
    when: "Sat, Nov 28, 2026 · 9:00 AM – 11:00 AM · 2h",
    guests: 4,
    total: 160,
    image: studioPhoto,
    location: "Brooklyn, New York",
    host: "Maya Thompson",
    requested: "2026-11-02",
  },
  {
    id: "SS-10517",
    studioId: 7,
    studio: "Echo Podcast Room",
    status: "Pending",
    when: "Fri, Dec 4, 2026 · 2:00 PM – 4:00 PM · 2h",
    guests: 3,
    total: 120,
    image: studioPodcast,
    location: "Chicago, Illinois",
    host: "Daniel Reyes",
    requested: "2026-11-10",
  },
  {
    id: "SS-10233",
    studioId: 2,
    studio: "Velvet Sound Suite",
    status: "Completed",
    when: "Mon, Oct 12, 2026 · 10:00 AM – 2:00 PM · 4h",
    guests: 5,
    total: 380,
    image: studioMusic,
    location: "Nashville, Tennessee",
    host: "Marcus Hale",
    requested: "2026-09-28",
  },
  {
    id: "SS-10101",
    studioId: 5,
    studio: "Lumen Film Stage",
    status: "Cancelled",
    when: "Sun, Sep 20, 2026 · 8:00 AM – 12:00 PM · 4h",
    guests: 12,
    total: 480,
    image: studioFilm,
    location: "Los Angeles, California",
    host: "Elena Cruz",
    requested: "2026-09-05",
  },
  {
    id: "SS-10388",
    studioId: 6,
    studio: "Hearth Creator Set",
    status: "Completed",
    when: "Wed, Oct 28, 2026 · 1:00 PM – 3:00 PM · 2h",
    guests: 2,
    total: 110,
    image: studioContent,
    location: "Austin, Texas",
    host: "Jordan Blake",
    requested: "2026-10-14",
  },
]

/* ---------- Saved Studios (/dashboard/saved-studios) ---------- */

/** Ids from `exploreStudios` (lib/Site-data.ts) the user has saved.
 *  TODO: replace with the signed-in user's saved list. */
export const savedStudioIds = [2, 7, 3, 6, 5, 8, 9]

/* ---------- Profile (/dashboard/profile) ---------- */

export const PROFILE_BIO_MAX = 280

/** TODO: replace with the signed-in user's profile. Name and email come from `dashboardUser`. */
export const dashboardProfile = {
  phone: "+1 (555) 014-2290",
  location: "New York, USA",
  bio: "Photographer and creative director based in New York.",
  bookings: allBookings.length,
  listings: 2,
  memberSince: 2024,
}

/* ---------- Settings (/dashboard/settings) ---------- */

export const notificationPrefs = [
  {
    id: "booking-updates",
    label: "Booking updates",
    description: "Confirmations, changes and reminders",
    defaultOn: true,
  },
  {
    id: "booking-requests",
    label: "Booking requests",
    description: "When renters request your studios",
    defaultOn: true,
  },
  {
    id: "weekly-digest",
    label: "Weekly email digest",
    description: "New studios near you",
    defaultOn: true,
  },
  {
    id: "marketing",
    label: "Marketing updates",
    description: "Offers and SetSpace news",
    defaultOn: false,
  },
]