"use client"

import { Building2, MapPin, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { StudioHoursSummary } from "@/components/Studio Opening Hours/Studio-opening-hours"
import {
  StudioListingBadge,
  StudioRatingDisplay,
} from "@/components/Studio Metadata/Studio-metadata"
import { Button, buttonVariants } from "@/components/ui/button"
import type { Studio } from "@/components/Studio card/Studio-card"
import { isMarketplaceStudioId } from "@/lib/Marketplace-api"
import { useStudioReviewStats } from "@/hooks/use-studio-review-stats"
import { cn, formatTaka } from "@/lib/utils"

type SavedStudioCardProps = {
  studio: Studio
  onRemove: () => void
  pending?: boolean
}

/** Studio card for the Saved Studios page: same look as `StudioCard`, with
 *  "View Studio" and "Remove" actions in place of the heart toggle. */
export function SavedStudioCard({
  studio,
  onRemove,
  pending = false,
}: SavedStudioCardProps) {
  const href = `/explore-studio/${studio.id}`
  const studioId = isMarketplaceStudioId(studio.id) ? studio.id : null
  const reviewStats = useStudioReviewStats(
    studioId,
    studio.rating,
    studio.reviews
  )

  return (
    <article className="group transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link
        href={href}
        aria-label={studio.name}
        className="relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-300 group-hover:border-primary/40 group-hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {studio.image ? (
          <Image
            src={studio.image}
            alt={studio.name}
            fill
            unoptimized={
              typeof studio.image === "string" &&
              !studio.image.startsWith("/_next/static/")
            }
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <Building2 className="size-8" strokeWidth={1.25} />
          </span>
        )}
        <div className="pointer-events-none absolute bottom-3 left-3 z-10">
          <StudioListingBadge
            createdAt={studio.createdAt}
            rating={reviewStats.rating}
            reviews={reviewStats.reviews}
          />
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-heading text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
            {studio.name}
          </h3>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 text-primary" />
            {studio.location}
          </p>
          <StudioRatingDisplay
            rating={reviewStats.rating}
            reviews={reviewStats.reviews}
            className="mt-1.5"
          />
        </div>

        <p className="shrink-0 text-right">
          <span className="font-heading text-base font-bold text-foreground">
            {formatTaka(studio.price)}
          </span>
          <span className="ml-0.5 text-[10px] text-muted-foreground">/hr</span>
        </p>
      </div>

      <StudioHoursSummary hours={studio.openingHours} />

      <div className="mt-4 flex gap-2">
        <Link
          href={href}
          className={cn(
            buttonVariants(),
            "btn-alive h-9 flex-1 text-xs font-semibold"
          )}
        >
          View Studio
        </Link>
        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
          disabled={pending}
          aria-busy={pending}
          aria-label={`Remove ${studio.name} from saved studios`}
          className="btn-alive h-9 gap-1.5 px-3 text-xs font-semibold hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
          Remove
        </Button>
      </div>
    </article>
  )
}
