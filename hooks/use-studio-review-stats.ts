"use client"

import * as React from "react"

export const STUDIO_REVIEW_STATS_EVENT = "setspace:studio-review-stats"

type StudioReviewStats = {
  studioId: string
  rating: number
  reviews: number
}

export function publishStudioReviewStats(
  studioId: string,
  reviews: readonly { rating: number }[]
) {
  if (typeof window === "undefined") return

  const reviewCount = reviews.length
  const rating = reviewCount
    ? Number(
        (
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        ).toFixed(1)
      )
    : 0

  window.dispatchEvent(
    new CustomEvent<StudioReviewStats>(STUDIO_REVIEW_STATS_EVENT, {
      detail: { studioId, rating, reviews: reviewCount },
    })
  )
}

export function useStudioReviewStats(
  studioId: string | null,
  initialRating: number,
  initialReviews: number
) {
  const [stats, setStats] = React.useState({
    studioId,
    rating: initialRating,
    reviews: initialReviews,
  })

  React.useEffect(() => {
    if (!studioId) return

    function onStatsUpdated(event: Event) {
      const { detail } = event as CustomEvent<StudioReviewStats>
      if (
        detail?.studioId === studioId &&
        Number.isFinite(detail.rating) &&
        Number.isInteger(detail.reviews) &&
        detail.reviews >= 0
      ) {
        setStats({
          studioId,
          rating: detail.rating,
          reviews: detail.reviews,
        })
      }
    }

    window.addEventListener(STUDIO_REVIEW_STATS_EVENT, onStatsUpdated)
    return () =>
      window.removeEventListener(STUDIO_REVIEW_STATS_EVENT, onStatsUpdated)
  }, [studioId])

  return stats.studioId === studioId
    ? stats
    : { rating: initialRating, reviews: initialReviews }
}
