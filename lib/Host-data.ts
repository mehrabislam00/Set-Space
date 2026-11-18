import {
  Briefcase,
  Building2,
  CalendarCheck,
  Clock,
  Inbox,
  Plus,
  Settings,
  Wallet,
} from "lucide-react"
import type { StaticImageData } from "next/image"
import studioLoft from "@/assets/studio-loft.jpg"
import {
  cloneWeeklyOpeningHours,
  DEFAULT_WEEKLY_OPENING_HOURS,
  type WeeklyOpeningHours,
} from "@/lib/Opening-hours"

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

/* ---------- My Studios (/host/my-studios) ---------- */

export type HostStudioStatus = "Published" | "Draft"

/** Every editable field on the Add / Edit Studio form. */
export type StudioFormData = {
  name: string
  category: string
  shortDescription: string
  fullDescription: string
  country: string
  city: string
  area: string
  streetAddress: string
  hourlyRate: string
  minimumHours: string
  cleaningFee: string
  maxGuests: string
  studioSize: string
  amenities: string[]
  photos: string[]
  availableDays: string[]
  opens: string
  closes: string
  openingHours: WeeklyOpeningHours
  unavailableDate: string
  cancellationPolicy: string
  studioRules: string
  additionalInstructions: string
}

export const STUDIO_CATEGORIES = [
  "Photo Studios",
  "Music Studios",
  "Podcast Studios",
  "Film Studios",
  "Content Creation Studios",
  "Art Studios",
]

export const STUDIO_AMENITIES = [
  "Professional Lighting",
  "Air Conditioning",
  "Wi-Fi",
  "Soundproofing",
  "Parking",
  "Changing Room",
  "Makeup Station",
  "Photography Equipment",
  "Kitchen Access",
]

export const STUDIO_CANCELLATION_POLICIES = ["Flexible", "Moderate", "Strict"]

export const DEFAULT_STUDIO_FORM_DATA: StudioFormData = {
  name: "",
  category: "Photo Studios",
  shortDescription: "",
  fullDescription: "",
  country: "Bangladesh",
  city: "",
  area: "",
  streetAddress: "",
  hourlyRate: "",
  minimumHours: "2",
  cleaningFee: "",
  maxGuests: "",
  studioSize: "",
  amenities: [],
  photos: [],
  availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  opens: "08:00",
  closes: "22:00",
  openingHours: DEFAULT_WEEKLY_OPENING_HOURS,
  unavailableDate: "",
  cancellationPolicy: "Flexible",
  studioRules: "",
  additionalInstructions: "",
}

/** Copy a form value so array fields are never shared between forms. */
export function cloneStudioFormData(data: StudioFormData): StudioFormData {
  return {
    ...data,
    amenities: [...data.amenities],
    photos: [...data.photos],
    availableDays: [...data.availableDays],
    openingHours: cloneWeeklyOpeningHours(data.openingHours),
  }
}

export type HostStudio = {
  id: string
  name: string
  category: string // singular badge text, e.g. "Photo Studio"
  city: string
  price: number
  status: HostStudioStatus
  image: StaticImageData | string | null
  /** Full record used by the Edit Studio form. */
  details: StudioFormData
}

export const hostSwitchLink = { label: "Switch to Renting", href: "/dashboard" }

export const hostNav: NavItem[] = [
  { label: "Overview", href: "/host", icon: Briefcase },
  { label: "My Studios", href: "/host/my-studios", icon: Building2 },
  { label: "Add Studio", href: "/host/my-studios/add-studio", icon: Plus },
  { label: "Booking Requests", href: "/host/bookings-request", icon: Inbox },
  { label: "Settings", href: "/host/settings", icon: Settings },
]

export const hostStats = [
  { label: "Total Studios", key: "totalStudios", icon: Building2 },
  { label: "Total Bookings", key: "totalBookings", icon: CalendarCheck },
  { label: "Pending Requests", key: "pendingRequests", icon: Clock },
  { label: "Earnings", key: "earnings", icon: Wallet },
] as const
