import studioPhoto from "@/assets/studio-photo.jpg"

export type BookingStatus =
  "Pending" | "Confirmed" | "Rejected" | "Completed" | "Cancelled"

export interface BookingRequest {
  id: string
  studioId?: string
  studioName: string
  studioLocation: string
  image: string
  renter: string
  date: string
  time: string
  durationHours: number
  guests: number
  total: number
  status: BookingStatus
  requestedOn: string
}

export const BOOKING_STATUS_TABS: ("All" | BookingStatus)[] = [
  "All",
  "Pending",
  "Confirmed",
  "Rejected",
  "Completed",
  "Cancelled",
]

// TODO: replace with real data from the bookings API
export const BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: "SS-20011",
    studioName: "Moonlight Loft",
    studioLocation: "SoHo, New York",
    image: studioPhoto.src,
    renter: "Sarah Kim",
    date: "Sun, Nov 22, 2026",
    time: "10:00 AM – 2:00 PM",
    durationHours: 4,
    guests: 6,
    total: 360,
    status: "Pending",
    requestedOn: "2026-11-12",
  },
  {
    id: "SS-20012",
    studioName: "Moonlight Loft",
    studioLocation: "SoHo, New York",
    image: studioPhoto.src,
    renter: "Leo Martins",
    date: "Wed, Nov 25, 2026",
    time: "3:00 PM – 6:00 PM",
    durationHours: 3,
    guests: 3,
    total: 270,
    status: "Pending",
    requestedOn: "2026-11-13",
  },
  {
    id: "SS-20009",
    studioName: "Moonlight Loft",
    studioLocation: "SoHo, New York",
    image: studioPhoto.src,
    renter: "Ava Johnson",
    date: "Wed, Nov 18, 2026",
    time: "9:00 AM – 12:00 PM",
    durationHours: 3,
    guests: 8,
    total: 270,
    status: "Confirmed",
    requestedOn: "2026-11-10",
  },
  {
    id: "SS-20004",
    studioName: "Moonlight Loft",
    studioLocation: "SoHo, New York",
    image: studioPhoto.src,
    renter: "Noah Brooks",
    date: "Fri, Oct 30, 2026",
    time: "12:00 PM – 4:00 PM",
    durationHours: 4,
    guests: 5,
    total: 360,
    status: "Completed",
    requestedOn: "2026-10-24",
  },
  {
    id: "SS-20002",
    studioName: "Moonlight Loft",
    studioLocation: "SoHo, New York",
    image: studioPhoto.src,
    renter: "Chloe Dubois",
    date: "Wed, Oct 14, 2026",
    time: "11:00 AM – 1:00 PM",
    durationHours: 2,
    guests: 2,
    total: 180,
    status: "Rejected",
    requestedOn: "2026-10-08",
  },
]
