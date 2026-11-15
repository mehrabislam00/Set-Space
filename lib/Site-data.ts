import { CalendarClock, CircleCheck, Sparkles, WandSparkles } from "lucide-react"
import studioArt from "@/assets/studio-art.jpg"
import studioContent from "@/assets/studio-content.jpg"
import studioFilm from "@/assets/studio-film.jpg"
import studioLoft from "@/assets/studio-loft.jpg"
import studioMusic from "@/assets/studio-music.jpg"
import studioPhoto from "@/assets/studio-photo.jpg"
import studioPodcast from "@/assets/studio-podcast.jpg"

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
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
    href: "/studios?category=photo",
  },
  {
    title: "Film Stages",
    description: "Sound stages & grip gear",
    image: studioFilm,
    href: "/studios?category=film",
  },
  {
    title: "Podcast Rooms",
    description: "Treated rooms, broadcast mics",
    image: studioPodcast,
    href: "/studios?category=podcast",
  },
  {
    title: "Music Suites",
    description: "Consoles, monitors & live rooms",
    image: studioMusic,
    href: "/studios?category=music",
  },
  {
    title: "Art Workshops",
    description: "Easels, north light & benches",
    image: studioArt,
    href: "/studios?category=art",
  },
  {
    title: "Content Studios",
    description: "Ready-styled creator sets",
    image: studioContent,
    href: "/studios?category=content",
  },
]

export const featuredStudios = [
  { id: 1, name: "The Aurora Studio", category: "Photo Studio", location: "New York, USA", price: 80, rating: 4.8, reviews: 245, image: studioPhoto },
  { id: 2, name: "Velvet Sound Suite", category: "Music Suite", location: "Nashville, USA", price: 95, rating: 4.9, reviews: 302, image: studioMusic },
  { id: 3, name: "Brick & Shadow Loft", category: "Photo Studio", location: "New York, USA", price: 110, rating: 4.9, reviews: 211, image: studioLoft },
  { id: 4, name: "Lumen Film Stage", category: "Film Stage", location: "Los Angeles, USA", price: 120, rating: 4.7, reviews: 189, image: studioFilm },
  { id: 5, name: "Hearth Creator Set", category: "Content Studio", location: "Austin, USA", price: 55, rating: 4.7, reviews: 156, image: studioContent },
  { id: 6, name: "Echo Podcast Room", category: "Podcast Room", location: "Chicago, USA", price: 60, rating: 4.8, reviews: 120, image: studioPodcast },
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
    description:
      "Hosts are identity-checked and rated by real creators.",
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
    description:
      "Arrive, set up and make your best work. The space is yours.",
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
      { label: "Explore Studios", href: "/studios" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Photo Studios", href: "/studios?category=photo" },
      { label: "Film Stages", href: "/studios?category=film" },
      { label: "Podcast Rooms", href: "/studios?category=podcast" },
      { label: "Music Suites", href: "/studios?category=music" },
      { label: "Art Workshops", href: "/studios?category=art" },
    ],
  },
  {
    title: "For Hosts",
    links: [
      { label: "List Your Studio", href: "/host" },
      { label: "Host Dashboard", href: "/host/dashboard" },
      { label: "Booking Requests", href: "/host/requests" },
      { label: "Help & Support", href: "/support" },
    ],
  },
]

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "FAQ", href: "/faq" },
]