"use client"

import { Building2, Heart, MapPin } from "lucide-react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { StudioHoursSummary } from "@/components/Studio Opening Hours/Studio-opening-hours"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/components/Dashboard/Wishlist-provider"
import { toast } from "@/components/ui/toast"
import {
  isMarketplaceStudioId,
  MarketplaceApiError,
} from "@/lib/Marketplace-api"
import {
  StudioListingBadge,
  StudioRatingDisplay,
} from "@/components/Studio Metadata/Studio-metadata"
import { useStudioReviewStats } from "@/hooks/use-studio-review-stats"
import type { WeeklyOpeningHours } from "@/lib/Opening-hours"
import { cn, formatTaka } from "@/lib/utils"

export type Studio = {
  id: number | string
  name: string
  category: string
  location: string
  price: number
  rating: number
  reviews: number
  createdAt: string | null
  image: StaticImageData | string | null
  openingHours: WeeklyOpeningHours
}

export function StudioCard({ studio }: { studio: Studio }) {
  const router = useRouter()
  const {
    authenticated,
    error: wishlistError,
    isPending,
    retry,
    savedStudioIds,
    status: wishlistStatus,
    toggleStudio,
  } = useWishlist()
  const studioId = isMarketplaceStudioId(studio.id) ? studio.id : null
  const reviewStats = useStudioReviewStats(
    studioId,
    studio.rating,
    studio.reviews
  )
  const canSave = studioId !== null
  const saved = studioId !== null && savedStudioIds.has(studioId)
  const pending = studioId !== null && isPending(studioId)

  async function onToggleSaved() {
    if (!studioId) return
    if (!authenticated) {
      router.push("/login")
      return
    }

    try {
      await toggleStudio(studioId)
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    }
  }

  return (
    <article className="group transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-300 group-hover:border-primary/40 group-hover:shadow-card-hover">
        <Link
          href={`/explore-studio/${studio.id}`}
          aria-label={studio.name}
          className="absolute inset-0 z-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-muted-foreground">
              <Building2 className="size-8" strokeWidth={1.25} />
            </span>
          )}
        </Link>

        <Badge className="pointer-events-none absolute top-3 left-3 z-10 border-0 bg-black/55 text-[10px] font-medium text-photo backdrop-blur-sm">
          {studio.category}
        </Badge>

        <div className="pointer-events-none absolute bottom-3 left-3 z-10">
          <StudioListingBadge
            createdAt={studio.createdAt}
            rating={reviewStats.rating}
            reviews={reviewStats.reviews}
          />
        </div>

        {canSave && (
          <Button
            type="button"
            size="icon"
            aria-label={
              wishlistStatus === "loading"
                ? "Loading saved studio status"
                : saved
                  ? `Remove ${studio.name} from saved studios`
                  : `Save ${studio.name}`
            }
            aria-pressed={saved}
            aria-busy={pending}
            disabled={
              pending ||
              wishlistStatus === "loading" ||
              wishlistStatus === "error"
            }
            onClick={onToggleSaved}
            className="btn-flat absolute top-3 right-3 z-10 size-8 rounded-full border-0 bg-black/55 text-photo backdrop-blur-sm hover:scale-110 hover:bg-black/75"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                saved && "fill-primary text-primary"
              )}
            />
          </Button>
        )}
      </div>

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
      {wishlistStatus === "error" && canSave ? (
        <p role="alert" className="mt-2 text-[11px] text-destructive">
          {wishlistError || "Saved studios could not be loaded."}{" "}
          <button
            type="button"
            onClick={retry}
            className="font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </p>
      ) : null}
    </article>
  )
}
