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
import studioContent from "@/assets/studio-content.jpg"
import studioFilm from "@/assets/studio-film.jpg"
import studioLoft from "@/assets/studio-loft.jpg"
import studioPhoto from "@/assets/studio-photo.jpg"

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
  country: "USA",
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
  }
}

export type HostStudio = {
  id: string
  studioId?: number // id from `exploreStudios`; only set once the listing is live
  name: string
  category: string // singular badge text, e.g. "Photo Studio"
  city: string
  price: number
  status: HostStudioStatus
  image: StaticImageData | string
  /** Full record used by the Edit Studio form. */
  details: StudioFormData
}

const moonlightLoftDetails: StudioFormData = {
  name: "Moonlight Loft",
  category: "Photo Studios",
  shortDescription: "Moody brick loft with painted backdrops.",
  fullDescription:
    "Exposed brick, painted canvas backdrops and huge factory windows. A character-rich loft for editorial and portrait work.",
  country: "USA",
  city: "New York",
  area: "SoHo",
  streetAddress: "",
  hourlyRate: "90",
  minimumHours: "2",
  cleaningFee: "",
  maxGuests: "25",
  studioSize: "1800",
  amenities: [
    "Professional Lighting",
    "Wi-Fi",
    "Changing Room",
    "Makeup Station",
    "Photography Equipment",
  ],
  photos: [studioLoft.src, studioPhoto.src, studioFilm.src, studioContent.src],
  availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  opens: "08:00",
  closes: "22:00",
  unavailableDate: "",
  cancellationPolicy: "Flexible",
  studioRules: "No open flames\nLoad-in via freight elevator",
  additionalInstructions: "",
}

const sunroomSetDetails: StudioFormData = {
  name: "The Sunroom Set",
  category: "Content Creation Studios",
  shortDescription: "Airy content set with movable furniture and soft light.",
  fullDescription:
    "A bright, flexible set for creator shoots, product content and interviews. The furniture can be rearranged to match your moodboard, and the north-facing windows stay soft all day.",
  country: "USA",
  city: "Brooklyn",
  area: "Greenpoint",
  streetAddress: "",
  hourlyRate: "65",
  minimumHours: "2",
  cleaningFee: "25",
  maxGuests: "8",
  studioSize: "900",
  amenities: ["Air Conditioning", "Wi-Fi", "Parking", "Kitchen Access"],
  photos: [studioContent.src, studioPhoto.src, studioFilm.src],
  availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  opens: "09:00",
  closes: "18:00",
  unavailableDate: "",
  cancellationPolicy: "Moderate",
  studioRules: "Return furniture to its original place\nNo smoking",
  additionalInstructions: "Street parking is available after 6 PM.",
}

// TODO: replace with the host's real listings
export const hostStudios: HostStudio[] = [
  {
    id: "studio-1",
    studioId: 4,
    name: "Moonlight Loft",
    category: "Photo Studio",
    city: "New York",
    price: 90,
    status: "Published",
    image: studioLoft,
    details: moonlightLoftDetails,
  },
  {
    id: "studio-2",
    name: "The Sunroom Set",
    category: "Content Studio",
    city: "Brooklyn",
    price: 65,
    status: "Draft",
    image: studioContent,
    details: sunroomSetDetails,
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
  {
    label: "Pending Requests",
    value: String(hostRequests.length),
    icon: Clock,
  },
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
