"use client"

import { format } from "date-fns"
import { Star } from "lucide-react"
import * as React from "react"

import { Reveal } from "@/components/Animation/Reveal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { StudioDetail, StudioReview } from "@/lib/Site-data"
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

/** Rating summary, distribution bars, review list and a write-a-review form. */
type StudioReviewData = Pick<
  StudioDetail,
  "rating" | "reviews" | "ratingBreakdown" | "reviewList"
>

export function StudioReviews({ studio }: { studio: StudioReviewData }) {
  const [reviews, setReviews] = React.useState<StudioReview[]>(studio.reviewList)
  const [rating, setRating] = React.useState(0)
  const [hover, setHover] = React.useState(0)
  const [comment, setComment] = React.useState("")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (rating === 0 || !comment.trim()) return

    // TODO: POST { studioId: studio.id, rating, comment } to your backend
    setReviews((prev) => [
      {
        id: `local-${Date.now()}`,
        name: "You",
        initials: "YO",
        rating,
        date: format(new Date(), "MMM d, yyyy"),
        comment: comment.trim(),
      },
      ...prev,
    ])
    setRating(0)
    setHover(0)
    setComment("")
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
              {studio.rating}
            </p>
            <Stars value={studio.rating} className="mt-2" />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {studio.reviews} reviews
            </p>
          </div>

          <ul className="min-w-56 flex-1 space-y-2">
            {studio.ratingBreakdown.map(({ stars, percent }) => (
              <li key={stars} className="flex items-center gap-3 text-[11px] text-muted-foreground">
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
                <p className="text-xs font-bold text-foreground">{review.name}</p>
                <Stars value={review.rating} />
                <p className="text-[11px] text-muted-foreground">{review.date}</p>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Reveal>
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <p className="font-heading text-xs font-bold text-foreground">
            Write a review
          </p>

          <div className="mt-3 flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                aria-pressed={rating === n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                className="rounded p-0.5 transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Star
                  className={cn(
                    "size-5 transition-colors",
                    n <= shown ? "fill-primary text-primary" : "text-muted-foreground/40"
                  )}
                />
              </button>
            ))}
          </div>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your session?"
            aria-label="Your review"
            rows={3}
            className="mt-3 min-h-20 resize-y text-xs"
          />

          <Button
            type="submit"
            size="sm"
            disabled={rating === 0 || !comment.trim()}
            className="btn-alive mt-3 text-xs"
          >
            Post review
          </Button>
        </form>
      </Reveal>
    </section>
  )
}