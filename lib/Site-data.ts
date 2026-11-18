import {
  AirVent,
  CalendarClock,
  Camera,
  CircleCheck,
  CircleParking,
  Coffee,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Shirt,
  Sparkles,
  WandSparkles,
  VolumeX,
  Wifi,
  LucideIcon,
} from "lucide-react"
import type { StaticImageData } from "next/image"
import heroStudio from "@/assets/hero-studio.jpg"
import studioArt from "@/assets/studio-art.jpg"
import studioContent from "@/assets/studio-content.jpg"
import studioFilm from "@/assets/studio-film.jpg"
import studioLoft from "@/assets/studio-loft.jpg"
import studioMusic from "@/assets/studio-music.jpg"
import studioPhoto from "@/assets/studio-photo.jpg"
import studioPodcast from "@/assets/studio-podcast.jpg"
import { DEFAULT_WEEKLY_OPENING_HOURS } from "@/lib/Opening-hours"
import type { WeeklyOpeningHours } from "@/lib/Opening-hours"

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/explore-studio" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
]

export const categories = [
  "All Categories",
  "Photo Studios",
  "Film Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
  "Content Studios",
]

export const stats = [
  { value: "1,200+", label: "studios" },
  { value: "48", label: "cities" },
  { value: "4.8★", label: "average rating" },
]

export const disciplines = [
  {
    title: "Photo Studios",
    description: "Cycloramas, strobes & backdrops",
    image: studioPhoto,
    href: "/explore-studio?category=photo",
  },
  {
    title: "Film Stages",
    description: "Sound stages & grip gear",
    image: studioFilm,
    href: "/explore-studio?category=film",
  },
  {
    title: "Podcast Rooms",
    description: "Treated rooms, broadcast mics",
    image: studioPodcast,
    href: "/explore-studio?category=podcast",
  },
  {
    title: "Music Suites",
    description: "Consoles, monitors & live rooms",
    image: studioMusic,
    href: "/explore-studio?category=music",
  },
  {
    title: "Art Workshops",
    description: "Easels, north light & benches",
    image: studioArt,
    href: "/explore-studio?category=art",
  },
  {
    title: "Content Studios",
    description: "Ready-styled creator sets",
    image: studioContent,
    href: "/explore-studio?category=content",
  },
]

export const whyFeatures = [
  {
    icon: WandSparkles,
    title: "Curated Creative Spaces",
    description:
      "Every studio is reviewed for light, sound and the gear you actually need.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Hourly Booking",
    description:
      "Book a single hour for a voiceover or a full week for a feature.",
  },
  {
    icon: CircleCheck,
    title: "Verified Studio Hosts",
    description: "Hosts are identity-checked and rated by real creators.",
  },
  {
    icon: Sparkles,
    title: "Simple Booking Experience",
    description:
      "Transparent pricing and instant requests. No email ping-pong.",
  },
]

export const steps = [
  {
    title: "Discover",
    description:
      "Browse curated studios by discipline, city, price and amenities.",
  },
  {
    title: "Book",
    description:
      "Pick your date and hours. See the full price before you request.",
  },
  {
    title: "Create",
    description: "Arrive, set up and make your best work. The space is yours.",
  },
]

export const howItWorksSteps = [
  {
    title: "Explore Studios",
    description: "Search by discipline, city, price and amenities.",
    image: studioPhoto,
    imageAlt: "White cyclorama photo studio with softbox lights",
  },
  {
    title: "Choose Your Space",
    description: "Compare photos, gear lists and reviews from real creators.",
    image: studioLoft,
    imageAlt: "Brick loft studio with a leather chair and studio light",
  },
  {
    title: "Book Your Time",
    description: "Pick a date and hours. See the full price upfront.",
    image: studioContent,
    imageAlt: "Cozy content set with a wooden table and string lights",
  },
  {
    title: "Create Something Great",
    description: "Arrive, set up and make your best work. The space is yours.",
    image: studioFilm,
    imageAlt: "Night film set with crew and street lights",
  },
]

export const hostSteps = [
  {
    title: "Create an Account",
    description: "One account lets you rent and host.",
  },
  {
    title: "List Your Studio",
    description: "Add photos, pricing, amenities and availability.",
  },
  {
    title: "Manage Bookings",
    description: "Accept or decline every request yourself.",
  },
  {
    title: "Welcome Creators",
    description: "Host great sessions and grow your reviews.",
  },
]

export const faqs = [
  {
    id: "book",
    question: "How do I book a studio?",
    answer:
      "Find a studio, pick a date and hours in the booking panel, and send a request. The host confirms, and you'll see the update in My Bookings and Notifications.",
  },
  {
    id: "charged",
    question: "When am I charged?",
    answer:
      "Your card is authorized when you send the request and charged only once the host confirms. If the host declines, you are never charged.",
  },
  {
    id: "cancel",
    question: "Can I cancel a booking?",
    answer:
      "Yes. Cancel at least 24 hours before the start time for a full refund. Later cancellations are charged at 50% of the booking total.",
  },
  {
    id: "both",
    question: "Can I be both a renter and a host?",
    answer:
      "Absolutely. One account covers both — switch between booking studios and managing your listings from the same dashboard.",
  },
  {
    id: "list",
    question: "How do I list my studio?",
    answer:
      "Click Add Studio, fill in the details, upload photos and set your availability. Save as draft or publish right away.",
  },
  {
    id: "verified",
    question: "Are hosts verified?",
    answer:
      "Every host completes identity verification before a listing goes live, and every review comes from a real booking.",
  },
]

export const testimonials = [
  {
    quote:
      "SetSpace made finding a cyc studio in Brooklyn take minutes, not days. The listings look exactly like the real rooms.",
    name: "Sarah Kim",
    role: "Fashion Photographer",
    initials: "SK",
  },
  {
    quote:
      "My suite went from half-empty to booked most weekends. Requests are easy to manage from my phone.",
    name: "Marcus Hale",
    role: "Studio Host, Nashville",
    initials: "MH",
  },
  {
    quote:
      "I book by the hour for every guest recording. Transparent pricing and zero back-and-forth emails.",
    name: "Priya Shah",
    role: "Podcast Producer",
    initials: "PS",
  },
]

export const footerColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Explore Studios", href: "/explore-studio" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Photo Studios", href: "/explore-studio?category=photo" },
      { label: "Film Stages", href: "/explore-studio?category=film" },
      { label: "Podcast Rooms", href: "/explore-studio?category=podcast" },
      { label: "Music Suites", href: "/explore-studio?category=music" },
      { label: "Art Workshops", href: "/explore-studio?category=art" },
    ],
  },
  {
    title: "For Hosts",
    links: [
      { label: "List Your Studio", href: "/host/my-studios/add-studio" },
      { label: "Host Dashboard", href: "/host" },
      { label: "Booking Requests", href: "/host/bookings-request" },
      { label: "Help & Support", href: "/frequenty-asked-questions" },
    ],
  },
]

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "FAQ", href: "/frequenty-asked-questions" },
]

/* ---------- About page ---------- */

export const aboutIntro = [
  {
    eyebrow: "Our story",
    title: "It started with a missed shoot.",
    body: "In 2022, our founder lost a campaign because she couldn't find a cyc studio in time. Great spaces were hidden behind word-of-mouth, PDFs and email chains. SetSpace exists to make every creative room in the city discoverable and bookable in minutes.",
  },
  {
    eyebrow: "Our mission",
    title: "Put the right room behind every idea.",
    body: "We connect photographers, filmmakers, podcasters, musicians and artists with hosts who care about their spaces—and help those hosts build sustainable businesses.",
  },
]

export const aboutDifferences = [
  {
    title: "Curated, not crowded",
    description: "We review every listing for light, sound and accuracy.",
  },
  {
    title: "Creator-first pricing",
    description: "Clear hourly rates. No surprise fees at checkout.",
  },
  {
    title: "One account, two roles",
    description: "Rent on Monday, host on Friday—no second login.",
  },
]

export const aboutStats = [
  { value: "1,200+", label: "Studios" },
  { value: "48", label: "Cities" },
  { value: "85k", label: "Sessions booked" },
  { value: "4.8★", label: "Average rating" },
]

/* ---------- Contact page ---------- */

export const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@setspace.co",
    href: "mailto:support@setspace.co",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 010-7788",
    href: "tel:+15550107788",
  },
  {
    icon: MapPin,
    label: "Studio HQ",
    value: "Brooklyn, New York",
    href: undefined as string | undefined,
  },
]

export const contactTopics = [
  "Booking help",
  "Hosting a studio",
  "Partnerships",
  "Billing & payments",
  "Something else",
]

/* ---------- Explore Studios page ---------- */

export type ExploreStudioItem = {
  id: number | string
  name: string
  category: string // badge text, singular
  discipline: string // matches an entry of `categories`
  city: string // used for filtering
  location: string // shown on the card, e.g. "New York, USA"
  price: number
  rating: number
  reviews: number
  createdAt: string | null
  featured?: boolean
  image: StaticImageData | string | null
  amenities: string[]
  openingHours: WeeklyOpeningHours
}

export const amenitiesList = [
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

export const sortOptions = [
  "Sort: Recommended",
  "Sort: Highest Rated",
  "Sort: Lowest Price",
  "Sort: Highest Price",
  "Sort: Most Popular",
]

export const priceRanges = [
  { label: "৳0–৳50", min: 0, max: 50 },
  { label: "৳50–৳100", min: 50, max: 100 },
  { label: "৳100–৳200+", min: 100, max: 200 },
]

export const ratingOptions = [
  { label: "4.8+ & above", value: 4.8 },
  { label: "4.5+ & above", value: 4.5 },
  { label: "4+ & above", value: 4 },
]

/** Maps the ?category= value used in links to a `categories` entry. */
export const categoryKeyMap: Record<string, string> = {
  photo: "Photo Studios",
  film: "Film Stages",
  podcast: "Podcast Rooms",
  music: "Music Suites",
  art: "Art Workshops",
  content: "Content Studios",
}

type RawStudio = Omit<
  ExploreStudioItem,
  "city" | "location" | "openingHours" | "rating" | "reviews" | "createdAt"
> & {
  location: string // city name only; "USA" is added below
}

const rawExploreStudios: RawStudio[] = [
  {
    id: 1,
    name: "The Aurora Studio",
    category: "Photo Studio",
    discipline: "Photo Studios",
    location: "New York",
    price: 80,
    image: studioPhoto,
    amenities: [
      "Professional Lighting",
      "Air Conditioning",
      "Wi-Fi",
      "Photography Equipment",
      "Changing Room",
    ],
  },
  {
    id: 2,
    name: "Velvet Sound Suite",
    category: "Music Suite",
    discipline: "Music Suites",
    location: "Nashville",
    price: 95,
    image: studioMusic,
    amenities: ["Soundproofing", "Air Conditioning", "Wi-Fi", "Parking"],
  },
  {
    id: 3,
    name: "Brick & Shadow Loft",
    category: "Photo Studio",
    discipline: "Photo Studios",
    location: "New York",
    price: 110,
    image: studioLoft,
    amenities: [
      "Professional Lighting",
      "Wi-Fi",
      "Makeup Station",
      "Photography Equipment",
    ],
  },
  {
    id: 4,
    name: "Moonlight Loft",
    category: "Photo Studio",
    discipline: "Photo Studios",
    location: "New York",
    price: 90,
    image: studioLoft,
    amenities: ["Professional Lighting", "Air Conditioning", "Changing Room"],
  },
  {
    id: 5,
    name: "Lumen Film Stage",
    category: "Film Stage",
    discipline: "Film Stages",
    location: "Los Angeles",
    price: 120,
    image: studioFilm,
    amenities: [
      "Professional Lighting",
      "Soundproofing",
      "Parking",
      "Kitchen Access",
    ],
  },
  {
    id: 6,
    name: "Hearth Creator Set",
    category: "Content Studio",
    discipline: "Content Studios",
    location: "Austin",
    price: 55,
    image: studioContent,
    amenities: ["Wi-Fi", "Professional Lighting", "Kitchen Access"],
  },
  {
    id: 7,
    name: "Echo Podcast Room",
    category: "Podcast Room",
    discipline: "Podcast Rooms",
    location: "Chicago",
    price: 60,
    image: studioPodcast,
    amenities: ["Soundproofing", "Wi-Fi", "Air Conditioning"],
  },
  {
    id: 8,
    name: "Midnight Stage",
    category: "Film Stage",
    discipline: "Film Stages",
    location: "Atlanta",
    price: 150,
    image: heroStudio,
    amenities: [
      "Professional Lighting",
      "Soundproofing",
      "Parking",
      "Air Conditioning",
    ],
  },
  {
    id: 9,
    name: "Golden Hour Studio",
    category: "Photo Studio",
    discipline: "Photo Studios",
    location: "Miami",
    price: 70,
    image: studioContent,
    amenities: [
      "Professional Lighting",
      "Makeup Station",
      "Changing Room",
      "Photography Equipment",
    ],
  },
  {
    id: 10,
    name: "Canvas & Light Atelier",
    category: "Art Workshop",
    discipline: "Art Workshops",
    location: "Portland",
    price: 45,
    image: studioArt,
    amenities: ["Wi-Fi", "Kitchen Access", "Parking"],
  },
  {
    id: 11,
    name: "Northwind Sound",
    category: "Music Suite",
    discipline: "Music Suites",
    location: "Seattle",
    price: 85,
    image: studioMusic,
    amenities: ["Soundproofing", "Wi-Fi", "Air Conditioning"],
  },
  {
    id: 12,
    name: "The Clay Room",
    category: "Art Workshop",
    discipline: "Art Workshops",
    location: "Austin",
    price: 40,
    image: studioArt,
    amenities: ["Air Conditioning", "Kitchen Access"],
  },
  {
    id: 13,
    name: "Studio Pulse",
    category: "Podcast Room",
    discipline: "Podcast Rooms",
    location: "Nashville",
    price: 50,
    image: studioPodcast,
    amenities: ["Soundproofing", "Wi-Fi", "Parking"],
  },
]

export const exploreStudios: ExploreStudioItem[] = rawExploreStudios.map(
  (studio) => ({
    ...studio,
    city: studio.location,
    location: `${studio.location}, USA`,
    rating: 0,
    reviews: 0,
    createdAt: null,
    openingHours: DEFAULT_WEEKLY_OPENING_HOURS,
  })
)

/* ---------- Studio detail page ---------- */

export type StudioReview = {
  id: string
  name: string
  initials: string
  rating: number
  date: string
  comment: string
}

export type StudioDetail = {
  id: number | string
  name: string
  category: string
  location: string
  price: number
  rating: number
  reviews: number
  createdAt: string | null
  openingHours: WeeklyOpeningHours
  images: { src: StaticImageData | string; alt: string }[]
  description: string
  size: string
  capacity: number
  minHours: number
  serviceFeeRate: number
  suitableFor: string[]
  rules: string[]
  amenities: { icon: LucideIcon; label: string }[]
  host: {
    name: string
    initials: string
    rating: number | null
    since: number | null
    bio: string
  }
  ratingBreakdown: { stars: number; percent: number }[]
  reviewList: StudioReview[]
}

/** Icon for each entry of `amenitiesList`. */
export const amenityIcons: Record<string, LucideIcon> = {
  "Professional Lighting": Lightbulb,
  "Air Conditioning": AirVent,
  "Wi-Fi": Wifi,
  Soundproofing: VolumeX,
  Parking: CircleParking,
  "Changing Room": Shirt,
  "Makeup Station": Sparkles,
  "Photography Equipment": Camera,
  "Kitchen Access": Coffee,
}

const auroraStudio: StudioDetail = {
  id: 1,
  name: "The Aurora Studio",
  category: "Photo Studio",
  location: "Brooklyn, New York, USA",
  price: 80,
  rating: 0,
  reviews: 0,
  createdAt: null,
  openingHours: DEFAULT_WEEKLY_OPENING_HOURS,
  images: [
    { src: studioPhoto, alt: "White cyclorama wall with two softbox lights" },
    { src: studioLoft, alt: "Brick loft corner with a leather armchair" },
    { src: heroStudio, alt: "Cinema camera on a tripod in a warm-lit studio" },
    { src: studioContent, alt: "Cozy content set with a sofa and ring light" },
    { src: studioFilm, alt: "Crew shooting on a lit stage with a dolly track" },
  ],
  description:
    "A premium photography studio with professional lighting, a seamless cyclorama wall and multiple backdrops. Floor-to-ceiling windows give soft north light by day, while full blackout lets you sculpt every shadow at night.",
  size: "1,000 sq ft",
  capacity: 20,
  minHours: 2,
  serviceFeeRate: 0.08,
  suitableFor: [
    "Fashion shoots",
    "Product photography",
    "Portraits",
    "Lookbooks",
  ],
  rules: [
    "No confetti or glitter",
    "Shoes off on the cyc",
    "Leave the space as you found it",
    "Free cancellation up to 24h before",
  ],
  amenities: [
    "Professional Lighting",
    "Air Conditioning",
    "Wi-Fi",
    "Changing Room",
    "Makeup Station",
    "Photography Equipment",
  ].map((label) => ({ icon: amenityIcons[label], label })),
  host: {
    name: "Maya Thompson",
    initials: "MT",
    rating: null,
    since: 2021,
    bio: "Fashion photographer turned studio owner. I built Aurora for the shoots I always wanted.",
  },
  ratingBreakdown: [5, 4, 3, 2, 1].map((stars) => ({ stars, percent: 0 })),
  reviewList: [],
}

/** Looks up a legacy demo studio by its route param. */
export function getStudioDetail(id: string): StudioDetail | undefined {
  const studio = exploreStudios.find((s) => String(s.id) === id)
  if (!studio) return undefined
  if (studio.id === auroraStudio.id) return auroraStudio

  return {
    ...auroraStudio,
    id: studio.id,
    name: studio.name,
    category: studio.category,
    location: studio.location,
    price: studio.price,
    rating: studio.rating,
    reviews: studio.reviews,
    createdAt: studio.createdAt,
    openingHours: studio.openingHours,
    images: [
      ...(studio.image ? [{ src: studio.image, alt: studio.name }] : []),
      ...auroraStudio.images
        .filter((img) => img.src !== studio.image)
        .slice(0, 4),
    ],
    amenities: studio.amenities
      .filter((label) => amenityIcons[label])
      .map((label) => ({ icon: amenityIcons[label], label })),
  }
}

/* ---------- Navbar notifications ---------- */

export type NotificationType =
  "booking" | "request" | "review" | "cancelled" | "listing"

export type NotificationItem = {
  id: string
  type: NotificationType
  title: string
  body: string
  time: string
  unread: boolean
  href: string
}

/** Routes with no hero photo behind the navbar. The navbar uses its solid
 *  (scrolled) look from the top of the page on these (see components/Navbar/navbar.tsx). */
export const solidNavRoutes = [
  "/dashboard",
  "/dashbord",
  "/host",
  "/notifications",
  "/explore-studio/", // studio detail pages (the trailing slash skips the list page, which has a banner)
]

/* ---------- Auth pages ---------- */

/** Routes that render without the Navbar and Footer (see components/Layout/Site-chrome.tsx). */
export const authRoutes = ["/login", "/register", "/forgot-password"]

/** Shortest password the demo auth forms accept. */
export const MIN_PASSWORD = 6
