import { Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { getStudioBadge } from "@/lib/Studio-badges"
import { cn } from "@/lib/utils"

export function StudioRatingDisplay({
  rating,
  reviews,
  className,
}: {
  rating: number
  reviews: number
  className?: string
}) {
  if (reviews <= 0) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        No reviews yet
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs text-muted-foreground",
        className
      )}
      aria-label={`${rating.toFixed(1)} out of 5 from ${reviews} ${
        reviews === 1 ? "review" : "reviews"
      }`}
    >
      <Star className="size-3.5 fill-primary text-primary" aria-hidden />
      <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
      <span>
        ({reviews} {reviews === 1 ? "review" : "reviews"})
      </span>
    </span>
  )
}

export function StudioListingBadge({
  createdAt,
  rating,
  reviews,
}: {
  createdAt: string | null
  rating: number
  reviews: number
}) {
  const badge = getStudioBadge({ createdAt, rating, reviews })
  if (!badge) return null

  return (
    <Badge
      className={cn(
        "border-0 text-[10px] font-semibold",
        badge === "New Listing"
          ? "bg-primary text-primary-foreground"
          : "bg-success/15 text-success"
      )}
    >
      {badge}
    </Badge>
  )
}
