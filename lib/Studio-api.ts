import {
  getStudioById,
  getStudioImageUrl,
  getStudios,
  type StudioRecord,
} from "@/lib/Marketplace-api"
import {
  amenityIcons,
  type ExploreStudioItem,
  type StudioDetail,
} from "@/lib/Site-data"
import type { HostStudio } from "@/lib/Host-data"
import {
  cloneWeeklyOpeningHours,
  resolveWeeklyOpeningHours,
} from "@/lib/Opening-hours"

const SUITABLE_FOR: Record<string, string[]> = {
  "Photo Studios": ["Photography", "Portraits", "Product shoots"],
  "Music Studios": ["Music recording", "Rehearsals", "Production"],
  "Podcast Studios": ["Podcasts", "Voice-over", "Interviews"],
  "Film Studios": ["Film production", "Commercials", "Video shoots"],
  "Content Creation Studios": [
    "Creator content",
    "Product shoots",
    "Interviews",
  ],
  "Art Studios": ["Painting", "Drawing", "Creative workshops"],
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "SS"
  )
}

function imageUrls(record: StudioRecord) {
  return (record.photos.length > 0 ? record.photos : record.details.photos)
    .map((photo) => getStudioImageUrl(photo))
    .filter((photo): photo is string => photo !== null)
}

export function toExploreStudio(record: StudioRecord): ExploreStudioItem {
  return {
    id: record.id,
    name: record.name,
    category: record.categoryLabel,
    discipline: record.discipline,
    city: record.city,
    location: record.location,
    price: record.price,
    rating: record.rating,
    reviews: record.reviews,
    createdAt: record.createdAt,
    featured: record.featured,
    image: getStudioImageUrl(record.image),
    amenities: record.details.amenities,
    openingHours: resolveWeeklyOpeningHours(
      record.details.openingHours,
      record.details.availableDays,
      record.details.opens,
      record.details.closes
    ),
  }
}

export function toHostStudio(record: StudioRecord): HostStudio {
  const photos = imageUrls(record)

  return {
    id: record.id,
    name: record.name,
    category: record.categoryLabel,
    city: record.city,
    price: record.price,
    status:
      record.status === "published" || record.status === "active"
        ? "Published"
        : "Draft",
    image: photos[0] ?? null,
    details: {
      ...record.details,
      photos,
      amenities: [...record.details.amenities],
      availableDays: [...record.details.availableDays],
      openingHours: cloneWeeklyOpeningHours(
        resolveWeeklyOpeningHours(
          record.details.openingHours,
          record.details.availableDays,
          record.details.opens,
          record.details.closes
        )
      ),
    },
  }
}

export async function getPublicStudios(signal?: AbortSignal) {
  const records = await getStudios(signal)
  return records.map(toExploreStudio)
}

export async function getPublicStudioDetail(
  id: string,
  signal?: AbortSignal
): Promise<StudioDetail> {
  const record = await getStudioById(id, signal)
  const photos = imageUrls(record)
  const name = record.ownerName || "Studio host"
  const createdAtValue = record.ownerCreatedAt || record.createdAt
  const createdAt = createdAtValue ? new Date(createdAtValue) : null
  const rules = record.details.studioRules
    .split(/\r?\n/)
    .map((rule) => rule.trim())
    .filter(Boolean)

  if (record.details.cancellationPolicy) {
    rules.push(`Cancellation policy: ${record.details.cancellationPolicy}`)
  }

  return {
    id: record.id,
    name: record.name,
    category: record.categoryLabel,
    location: record.location,
    price: record.price,
    rating: record.rating,
    reviews: record.reviews,
    createdAt: record.createdAt,
    openingHours: resolveWeeklyOpeningHours(
      record.details.openingHours,
      record.details.availableDays,
      record.details.opens,
      record.details.closes
    ),
    images: photos.map((src, index) => ({
      src,
      alt: `${record.name} photo ${index + 1}`,
    })),
    description:
      record.details.fullDescription || record.details.shortDescription,
    size: record.details.studioSize
      ? `${record.details.studioSize} sq ft`
      : "Not specified",
    capacity: Number(record.details.maxGuests) || 0,
    minHours: Number(record.details.minimumHours) || 1,
    serviceFeeRate: 0.08,
    suitableFor: SUITABLE_FOR[record.details.category] ?? [],
    rules,
    amenities: record.details.amenities.flatMap((label) =>
      amenityIcons[label] ? [{ icon: amenityIcons[label], label }] : []
    ),
    host: {
      name,
      initials: initials(name),
      rating: null,
      since:
        createdAt && !Number.isNaN(createdAt.getTime())
          ? createdAt.getFullYear()
          : null,
      bio: "Studio host on SetSpace.",
    },
    ratingBreakdown: [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      percent: 0,
    })),
    reviewList: [],
  }
}
