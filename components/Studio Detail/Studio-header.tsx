"use client"

import { Check, Heart, MapPin, Share2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/components/Dashboard/Wishlist-provider"
import { toast } from "@/components/ui/toast"
import {
  StudioListingBadge,
  StudioRatingDisplay,
} from "@/components/Studio Metadata/Studio-metadata"
import { useStudioReviewStats } from "@/hooks/use-studio-review-stats"
import {
  isMarketplaceStudioId,
  MarketplaceApiError,
} from "@/lib/Marketplace-api"
import type { StudioDetail } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

/** Breadcrumb, title, rating/location line, share + save buttons. */
type StudioHeaderData = Pick<
  StudioDetail,
  "id" | "name" | "category" | "rating" | "reviews" | "createdAt" | "location"
>

export function StudioHeader({ studio }: { studio: StudioHeaderData }) {
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
  const reviewStats = useStudioReviewStats(
    isMarketplaceStudioId(studio.id) ? studio.id : null,
    studio.rating,
    studio.reviews
  )
  const [copied, setCopied] = React.useState(false)
  const studioId = isMarketplaceStudioId(studio.id) ? studio.id : null
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

  async function onShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: studio.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      // user closed the share sheet — nothing to do
    }
  }

  return (
    <header className="stagger-in">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link
          href="/explore-studio"
          className="transition-colors hover:text-primary"
        >
          Explore
        </Link>
        <span>/</span>
        <span>{studio.category}</span>
        <span>/</span>
        <span aria-current="page" className="font-semibold text-foreground">
          {studio.name}
        </span>
      </nav>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-0 bg-accent text-[10px] font-medium text-accent-foreground">
              {studio.category}
            </Badge>
            <StudioListingBadge
              createdAt={studio.createdAt}
              rating={reviewStats.rating}
              reviews={reviewStats.reviews}
            />
          </div>
          <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {studio.name}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <StudioRatingDisplay
              rating={reviewStats.rating}
              reviews={reviewStats.reviews}
            />
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 text-primary" />
              {studio.location}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onShare}
            className="btn-flat rounded-full px-3 text-xs"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Share2 className="size-3.5" />
            )}
            {copied ? "Link copied" : "Share"}
          </Button>
          {studioId && (
            <Button
              type="button"
              variant="outline"
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
              className="btn-flat rounded-full"
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
      </div>
      {wishlistStatus === "error" && studioId ? (
        <p role="alert" className="mt-3 text-xs text-destructive">
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
    </header>
  )
}
