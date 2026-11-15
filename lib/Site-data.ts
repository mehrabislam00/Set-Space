import studioArt from "@/assets/studio-art.jpg"
import studioContent from "@/assets/studio-content.jpg"
import studioFilm from "@/assets/studio-film.jpg"
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