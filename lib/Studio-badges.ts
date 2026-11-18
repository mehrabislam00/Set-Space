export const NEW_LISTING_PERIOD_DAYS = 7
export const TOP_RATED_MINIMUM_REVIEWS = 10
export const TOP_RATED_MINIMUM_RATING = 4.8

export type StudioBadge = "New Listing" | "Top Rated"

export function getStudioBadge(
  studio: {
    createdAt: string | null
    rating: number
    reviews: number
  },
  now = new Date()
): StudioBadge | null {
  const createdAt = studio.createdAt ? new Date(studio.createdAt) : null
  const ageInMilliseconds = createdAt ? now.getTime() - createdAt.getTime() : -1

  if (
    createdAt &&
    !Number.isNaN(createdAt.getTime()) &&
    ageInMilliseconds >= 0 &&
    ageInMilliseconds < NEW_LISTING_PERIOD_DAYS * 24 * 60 * 60 * 1000
  ) {
    return "New Listing"
  }

  if (
    studio.reviews >= TOP_RATED_MINIMUM_REVIEWS &&
    studio.rating >= TOP_RATED_MINIMUM_RATING
  ) {
    return "Top Rated"
  }

  return null
}
