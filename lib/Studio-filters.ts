import type { ExploreStudioItem } from "@/lib/Site-data"

export const PRICE_MAX = 200 // slider max means "৳200+" (no upper limit)

export type Filters = {
  query: string
  category: string
  location: string
  priceMin: number
  priceMax: number
  rating: number // 0 = any
  amenities: string[]
  sort: string
}

export const defaultFilters: Filters = {
  query: "",
  category: "All Categories",
  location: "All Locations",
  priceMin: 0,
  priceMax: PRICE_MAX,
  rating: 0,
  amenities: [],
  sort: "Sort: Recommended",
}

export function hasActiveFilters(f: Filters) {
  return (
    f.query !== "" ||
    f.category !== defaultFilters.category ||
    f.location !== defaultFilters.location ||
    f.priceMin !== 0 ||
    f.priceMax !== PRICE_MAX ||
    f.rating !== 0 ||
    f.amenities.length > 0
  )
}

export function applyFilters(
  f: Filters,
  studios: ExploreStudioItem[]
): ExploreStudioItem[] {
  // every typed word must appear somewhere in name / city / category
  const terms = f.query.trim().toLowerCase().split(/\s+/).filter(Boolean)

  const list = studios.filter((s) => {
    const haystack =
      `${s.name} ${s.location} ${s.category} ${s.discipline}`.toLowerCase()
    if (!terms.every((t) => haystack.includes(t))) return false
    if (f.category !== defaultFilters.category && s.discipline !== f.category)
      return false
    if (f.location !== defaultFilters.location && s.location !== f.location)
      return false
    if (s.price < f.priceMin) return false
    if (f.priceMax < PRICE_MAX && s.price > f.priceMax) return false
    if (f.rating && s.rating < f.rating) return false
    if (!f.amenities.every((a) => s.amenities.includes(a))) return false
    return true
  })

  switch (f.sort) {
    case "Sort: Highest Rated":
      return [...list].sort(
        (a, b) => b.rating - a.rating || b.reviews - a.reviews
      )
    case "Sort: Lowest Price":
      return [...list].sort((a, b) => a.price - b.price)
    case "Sort: Highest Price":
      return [...list].sort((a, b) => b.price - a.price)
    case "Sort: Most Popular":
      return [...list].sort((a, b) => b.reviews - a.reviews)
    default:
      return list // recommended = curated order in Site-data
  }
}
