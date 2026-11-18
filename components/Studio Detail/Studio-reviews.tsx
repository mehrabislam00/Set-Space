"use client"

import { format } from "date-fns"
import { LoaderCircle, Star } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Reveal } from "@/components/Animation/Reveal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import type { StudioDetail, StudioReview } from "@/lib/Site-data"
import {
  createReview,
  getReviewEligibility,
  getReviews,
  MarketplaceApiError,
  type MarketplaceReview,
} from "@/lib/Marketplace-api"
import { publishStudioReviewStats } from "@/hooks/use-studio-review-stats"
import { cn } from "@/lib/utils"

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn("flex gap-0.5", className)}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3",
            i < Math.round(value)
              ? "fill-primary text-primary"
              : "text-muted-foreground/40"
          )}
        />
      ))}
    </span>
  )
}

type StudioReviewData = Pick<
  StudioDetail,
  "rating" | "reviews" | "ratingBreakdown" | "reviewList"
>

type EligibilityState =
  "loading" | "eligible" | "unavailable" | "unauthenticated" | "error"

function reviewInitials(name: string) {
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

function toStudioReview(review: MarketplaceReview): StudioReview {
  return {
    id: review.id,
    name: review.reviewerName,
    initials: reviewInitials(review.reviewerName),
    rating: review.rating,
    date: format(new Date(review.createdAt), "MMM d, yyyy"),
    comment: review.comment,
  }
}

/** Rating summary, review list and booking-verified review form. */
export function StudioReviews({
  studio,
  studioId,
}: {
  studio: StudioReviewData
  studioId: string | null
}) {
  const [reviews, setReviews] = React.useState<StudioReview[]>(
    studio.reviewList
  )
  const [reviewsLoading, setReviewsLoading] = React.useState(Boolean(studioId))
  const [reviewsError, setReviewsError] = React.useState<string | null>(null)
  const [eligibilityState, setEligibilityState] =
    React.useState<EligibilityState>(studioId ? "loading" : "unavailable")
  const [eligibilityError, setEligibilityError] = React.useState<string | null>(
    null
  )
  const [bookingId, setBookingId] = React.useState<string | null>(null)
  const [reloadKey, setReloadKey] = React.useState(0)
  const [rating, setRating] = React.useState(0)
  const [hover, setHover] = React.useState(0)
  const [comment, setComment] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitSuccess, setSubmitSuccess] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!studioId) return

    const controller = new AbortController()
    getReviews(studioId, controller.signal)
      .then((records) => {
        const nextReviews = records.map(toStudioReview)
        setReviews(nextReviews)
        publishStudioReviewStats(studioId, nextReviews)
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return
        setReviewsError(
          error instanceof Error ? error.message : "Could not load reviews."
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setReviewsLoading(false)
      })

    getReviewEligibility(studioId, controller.signal)
      .then((eligibility) => {
        setBookingId(eligibility.bookingId)
        setEligibilityState(eligibility.canReview ? "eligible" : "unavailable")
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return
        setBookingId(null)
        setEligibilityError(
          error instanceof Error
            ? error.message
            : "Could not check review eligibility."
        )
        setEligibilityState(
          error instanceof MarketplaceApiError && error.status === 401
            ? "unauthenticated"
            : "error"
        )
      })

    return () => controller.abort()
  }, [studioId, reloadKey])

  const loadedApiReviews = Boolean(studioId) && !reviewsLoading && !reviewsError
  const averageRating =
    loadedApiReviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : loadedApiReviews
        ? 0
        : studio.rating
  const reviewCount = loadedApiReviews ? reviews.length : studio.reviews
  const ratingBreakdown = loadedApiReviews
    ? [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        percent:
          reviews.length === 0
            ? 0
            : Math.round(
                (reviews.filter((review) => review.rating === stars).length /
                  reviews.length) *
                  100
              ),
      }))
    : studio.ratingBreakdown

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (
      !studioId ||
      !bookingId ||
      rating === 0 ||
      !comment.trim() ||
      isSubmitting
    ) {
      return
    }

    setIsSubmitting(true)
    setSubmitSuccess(null)

    try {
      const createdReview = await createReview({
        studioId,
        bookingId,
        rating,
        comment: comment.trim(),
      })
      const nextReviews = [toStudioReview(createdReview), ...reviews]
      setReviews(nextReviews)
      publishStudioReviewStats(studioId, nextReviews)
      setRating(0)
      setHover(0)
      setComment("")
      setSubmitSuccess("Thank you — your review has been posted.")

      try {
        const eligibility = await getReviewEligibility(studioId)
        setBookingId(eligibility.bookingId)
        setEligibilityState(eligibility.canReview ? "eligible" : "unavailable")
        setEligibilityError(null)
      } catch (error) {
        setBookingId(null)
        setEligibilityError(
          error instanceof Error
            ? error.message
            : "Could not refresh review eligibility."
        )
        setEligibilityState(
          error instanceof MarketplaceApiError && error.status === 401
            ? "unauthenticated"
            : "error"
        )
      }
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const shown = hover || rating

  return (
    <section id="reviews" className="scroll-mt-40">
      <Reveal>
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
          Reviews
        </h2>

        <div className="mt-6 flex flex-wrap items-center gap-8">
          <div>
            <p className="font-heading text-5xl font-extrabold tracking-tight text-foreground">
              {reviewCount > 0 ? averageRating.toFixed(1) : "—"}
            </p>
            <Stars value={averageRating} className="mt-2" />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {reviewCount > 0
                ? `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`
                : "No reviews yet"}
            </p>
          </div>

          <ul className="min-w-56 flex-1 space-y-2">
            {ratingBreakdown.map(({ stars, percent }) => (
              <li
                key={stars}
                className="flex items-center gap-3 text-[11px] text-muted-foreground"
              >
                <span className="w-2 text-right">{stars}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="w-8 text-right">{percent}%</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {reviewsLoading ? (
        <div
          aria-label="Loading reviews"
          aria-busy="true"
          className="mt-8 space-y-4"
        >
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : reviewsError ? (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive"
        >
          {reviewsError}{" "}
          <button
            type="button"
            className="font-semibold underline underline-offset-2"
            onClick={() => {
              setReviewsLoading(true)
              setReviewsError(null)
              setReloadKey((key) => key + 1)
            }}
          >
            Try again
          </button>
        </div>
      ) : reviews.length > 0 ? (
        <ul className="mt-8 divide-y divide-border border-t border-border">
          {reviews.map((review) => (
            <li key={review.id} className="flex gap-3.5 py-5">
              <Avatar className="size-9 bg-secondary">
                <AvatarFallback className="bg-transparent text-[10px] font-semibold text-muted-foreground">
                  {review.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <p className="text-xs font-bold text-foreground">
                    {review.name}
                  </p>
                  <Stars value={review.rating} />
                  <p className="text-[11px] text-muted-foreground">
                    {review.date}
                  </p>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
          No reviews yet. Complete a session and be the first to share your
          experience.
        </p>
      )}

      <Reveal>
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          {submitSuccess && (
            <p role="status" className="mb-3 text-xs text-success">
              {submitSuccess}
            </p>
          )}
          {eligibilityState === "loading" ? (
            <div aria-label="Checking review eligibility" aria-busy="true">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-4 h-10 w-full" />
            </div>
          ) : eligibilityState === "eligible" && bookingId ? (
            <form onSubmit={onSubmit}>
              <p className="font-heading text-xs font-bold text-foreground">
                Write a review
              </p>

              <div className="mt-3 flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    aria-pressed={rating === value}
                    disabled={isSubmitting}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHover(value)}
                    className="rounded p-0.5 transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Star
                      className={cn(
                        "size-5 transition-colors",
                        value <= shown
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/40"
                      )}
                    />
                  </button>
                ))}
              </div>

              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="How was your session?"
                aria-label="Your review"
                maxLength={2000}
                rows={3}
                disabled={isSubmitting}
                className="mt-3 min-h-20 resize-y text-xs"
              />

              {eligibilityError && (
                <p role="alert" className="mt-2 text-xs text-destructive">
                  {eligibilityError}
                </p>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={
                  rating === 0 || !comment.trim() || isSubmitting || !bookingId
                }
                className="btn-alive mt-3 text-xs"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-3.5 animate-spin" />
                    Posting…
                  </>
                ) : (
                  "Post review"
                )}
              </Button>
            </form>
          ) : eligibilityState === "unauthenticated" ? (
            <p className="text-xs text-muted-foreground">
              <Link
                href="/login"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                Sign in
              </Link>{" "}
              and complete a booking to write a review.
            </p>
          ) : eligibilityState === "error" ? (
            <p role="alert" className="text-xs text-destructive">
              {eligibilityError || "Could not check review eligibility."}{" "}
              <button
                type="button"
                className="font-semibold underline underline-offset-2"
                onClick={() => {
                  setEligibilityState("loading")
                  setEligibilityError(null)
                  setReloadKey((key) => key + 1)
                }}
              >
                Try again
              </button>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              You can write a review after a booking for this studio is
              completed.
            </p>
          )}
        </div>
      </Reveal>
    </section>
  )
}
