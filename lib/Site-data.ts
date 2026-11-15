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