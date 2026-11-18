"use client"

import { format } from "date-fns"
import { CalendarDays, Check, LoaderCircle, Minus, Plus } from "lucide-react"
import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TimePicker } from "@/components/Host/Time-picker"
import { StudioRatingDisplay } from "@/components/Studio Metadata/Studio-metadata"
import { useStudioReviewStats } from "@/hooks/use-studio-review-stats"
import {
  createBooking,
  isMarketplaceStudioId,
  MarketplaceApiError,
} from "@/lib/Marketplace-api"
import { formatTaka } from "@/lib/utils"

type BookingCardProps = {
  studioId: string | null
  price: number
  rating: number
  reviews: number
  capacity: number
  minHours: number
  serviceFeeRate: number
}

const OPEN_HOUR = 6
const CLOSE_HOUR = 23

const OPEN_MINUTE = OPEN_HOUR * 60
const CLOSE_MINUTE = CLOSE_HOUR * 60

function parseTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  return (hours || 0) * 60 + (minutes || 0)
}

function timeValue(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
}

function timeLabel(value: string) {
  const minutes = parseTime(value)
  const hours = Math.floor(minutes / 60)
  return `${hours % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${
    hours < 12 ? "AM" : "PM"
  }`
}

/** Sticky booking panel: date, time range, guests and a live price breakdown. */
export function BookingCard({
  studioId,
  price,
  rating,
  reviews,
  capacity,
  minHours,
  serviceFeeRate,
}: BookingCardProps) {
  const [date, setDate] = React.useState<Date | undefined>()
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [start, setStart] = React.useState("09:00")
  const [end, setEnd] = React.useState(
    timeValue(Math.min(9 * 60 + minHours * 60, CLOSE_MINUTE))
  )
  const [guests, setGuests] = React.useState(2)
  const [requested, setRequested] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const reviewStats = useStudioReviewStats(
    studioId && isMarketplaceStudioId(studioId) ? studioId : null,
    rating,
    reviews
  )

  const startMinutes = parseTime(start)
  const endMinutes = parseTime(end)
  const hours = Math.max(endMinutes - startMinutes, 0) / 60
  const subtotal = price * Math.max(hours, 0)
  const fee = Math.round(subtotal * serviceFeeRate)
  const total = subtotal + fee

  const tooShort = hours < minHours
  const canRequest = !!studioId && !!date && !tooShort && !isSubmitting

  function onStartChange(value: string) {
    const next = Math.min(Math.max(parseTime(value), OPEN_MINUTE), CLOSE_MINUTE)
    setStart(timeValue(next))
    if (endMinutes - next < minHours * 60) {
      setEnd(timeValue(Math.min(next + minHours * 60, CLOSE_MINUTE)))
    }
  }

  async function onRequest() {
    if (!canRequest || !studioId || !date) return

    setIsSubmitting(true)
    setError(null)
    try {
      await createBooking({
        studioId,
        bookingDate: format(date, "yyyy-MM-dd"),
        startTime: start,
        endTime: end,
        guests,
      })
      setRequested(true)
    } catch (requestError) {
      if (
        requestError instanceof MarketplaceApiError &&
        requestError.status === 401
      ) {
        setError(requestError)
      } else if (!(requestError instanceof MarketplaceApiError)) {
        setError(null)
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-heading text-2xl font-extrabold text-foreground">
          {formatTaka(price)}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            /hr
          </span>
        </p>
        <StudioRatingDisplay
          rating={reviewStats.rating}
          reviews={reviewStats.reviews}
          className="justify-end text-right"
        />
      </div>

      {requested ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-6" />
          </span>
          <h3 className="font-heading text-base font-bold text-foreground">
            Request sent
          </h3>
          <p className="max-w-56 text-xs leading-relaxed text-muted-foreground">
            {date && format(date, "PPP")}, {timeLabel(start)} – {timeLabel(end)}
            . The host will confirm shortly. You won&apos;t be charged until
            then.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-1 text-xs"
            onClick={() => {
              setRequested(false)
              setError(null)
            }}
          >
            Edit request
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground">Select date</p>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger
                  aria-label="Select date"
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 text-sm transition-colors outline-none hover:border-primary/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span
                    className={
                      date ? "text-foreground" : "text-muted-foreground"
                    }
                  >
                    {date ? format(date, "PPP") : "Pick a date"}
                  </span>
                  <CalendarDays className="size-4 text-muted-foreground" />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d)
                      setCalendarOpen(false)
                    }}
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-[11px] text-muted-foreground">Start</p>
                <TimePicker
                  ariaLabel="Start time"
                  value={start}
                  onChange={onStartChange}
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] text-muted-foreground">End</p>
                <TimePicker
                  ariaLabel="End time"
                  value={end}
                  onChange={(value) =>
                    setEnd(
                      timeValue(
                        Math.min(
                          Math.max(parseTime(value), OPEN_MINUTE),
                          CLOSE_MINUTE
                        )
                      )
                    )
                  }
                />
              </div>
            </div>

            {tooShort && (
              <p role="alert" className="text-[11px] text-destructive">
                Minimum booking is {minHours} hours.
              </p>
            )}

            {!studioId && (
              <p className="text-[11px] text-muted-foreground">
                Booking is unavailable for this listing.
              </p>
            )}

            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground">
                Guests (max {capacity})
              </p>
              <div className="flex h-10 items-center justify-between rounded-lg border border-input px-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Remove a guest"
                  disabled={guests <= 1}
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="btn-flat rounded-full"
                >
                  <Minus className="size-3" />
                </Button>
                <span
                  className="text-sm font-bold text-foreground"
                  aria-live="polite"
                >
                  {guests}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Add a guest"
                  disabled={guests >= capacity}
                  onClick={() => setGuests((g) => Math.min(capacity, g + 1))}
                  className="btn-flat rounded-full"
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>
          </div>

          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <dt>
                {formatTaka(price)} × {Math.max(hours, 0)} hr
              </dt>
              <dd>{formatTaka(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Service fee</dt>
              <dd>{formatTaka(fee)}</dd>
            </div>
            <div className="flex items-center justify-between pt-2">
              <dt className="font-heading text-sm font-bold text-foreground">
                Total
              </dt>
              <dd className="font-heading text-base font-extrabold text-primary">
                {formatTaka(total)}
              </dd>
            </div>
          </dl>

          {error instanceof MarketplaceApiError && error.status === 401 && (
            <p role="alert" className="mt-4 text-xs text-destructive">
              <Link
                href="/login"
                className="font-semibold underline underline-offset-2"
              >
                Sign in to continue
              </Link>
            </p>
          )}

          <Button
            type="button"
            size="lg"
            disabled={!canRequest}
            onClick={onRequest}
            className="btn-alive mt-5 w-full"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Sending request…
              </>
            ) : (
              "Request to Book"
            )}
          </Button>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            {!studioId
              ? "This studio cannot be booked online"
              : date
                ? "You won't be charged yet · Free cancellation up to 24h"
                : "Pick a date to request this studio"}
          </p>
        </>
      )}
    </div>
  )
}
