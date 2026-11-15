"use client"

import { format } from "date-fns"
import { CalendarDays, Check, Minus, Plus, Star } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type BookingCardProps = {
  price: number
  rating: number
  capacity: number
  minHours: number
  serviceFeeRate: number
}

const OPEN_HOUR = 6
const CLOSE_HOUR = 23

function hourLabel(h: number) {
  return `${h % 12 || 12}:00 ${h < 12 ? "AM" : "PM"}`
}

const hourOf = (label: string) =>
  Array.from({ length: CLOSE_HOUR - OPEN_HOUR + 1 }, (_, i) => OPEN_HOUR + i).find(
    (h) => hourLabel(h) === label
  ) ?? OPEN_HOUR

const startHours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i)
const endHours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + 1 + i)

/** Sticky booking panel: date, time range, guests and a live price breakdown. */
export function BookingCard({
  price,
  rating,
  capacity,
  minHours,
  serviceFeeRate,
}: BookingCardProps) {
  const [date, setDate] = React.useState<Date | undefined>()
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [start, setStart] = React.useState(9)
  const [end, setEnd] = React.useState(9 + minHours)
  const [guests, setGuests] = React.useState(2)
  const [requested, setRequested] = React.useState(false)

  const hours = end - start
  const subtotal = price * Math.max(hours, 0)
  const fee = Math.round(subtotal * serviceFeeRate)
  const total = subtotal + fee

  const tooShort = hours < minHours
  const canRequest = !!date && !tooShort

  function onStartChange(label: string) {
    const next = hourOf(label)
    setStart(next)
    if (end - next < minHours) setEnd(Math.min(next + minHours, CLOSE_HOUR))
  }

  function onRequest() {
    if (!canRequest) return
    // TODO: send { date, start, end, guests } to your bookings API
    setRequested(true)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-heading text-2xl font-extrabold text-foreground">
          ${price}
          <span className="ml-1 text-xs font-normal text-muted-foreground">/hr</span>
        </p>
        <p className="flex items-center gap-1 text-xs font-bold text-foreground">
          <Star className="size-3.5 fill-primary text-primary" />
          {rating}
        </p>
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
            {date && format(date, "PPP")}, {hourLabel(start)} – {hourLabel(end)}.
            The host will confirm shortly. You won&apos;t be charged until then.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-1 text-xs"
            onClick={() => setRequested(false)}
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
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors hover:border-primary/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className={date ? "text-foreground" : "text-muted-foreground"}>
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
                <Select
                  value={hourLabel(start)}
                  onValueChange={(v) => v && onStartChange(v)}
                >
                  <SelectTrigger aria-label="Start time" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent sideOffset={8} className="rounded-xl border-border bg-popover p-1.5">
                    {startHours.map((h) => (
                      <SelectItem key={h} value={hourLabel(h)} className="rounded-md py-2 text-xs">
                        {hourLabel(h)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] text-muted-foreground">End</p>
                <Select
                  value={hourLabel(end)}
                  onValueChange={(v) => v && setEnd(hourOf(v))}
                >
                  <SelectTrigger aria-label="End time" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent sideOffset={8} className="rounded-xl border-border bg-popover p-1.5">
                    {endHours.map((h) => (
                      <SelectItem key={h} value={hourLabel(h)} className="rounded-md py-2 text-xs">
                        {hourLabel(h)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {tooShort && (
              <p role="alert" className="text-[11px] text-destructive">
                Minimum booking is {minHours} hours.
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
                <span className="text-sm font-bold text-foreground" aria-live="polite">
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
                ${price} × {Math.max(hours, 0)} hr
              </dt>
              <dd>${subtotal}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Service fee</dt>
              <dd>${fee}</dd>
            </div>
            <div className="flex items-center justify-between pt-2">
              <dt className="font-heading text-sm font-bold text-foreground">Total</dt>
              <dd className="font-heading text-base font-extrabold text-primary">
                ${total}
              </dd>
            </div>
          </dl>

          <Button
            type="button"
            size="lg"
            disabled={!canRequest}
            onClick={onRequest}
            className="btn-alive mt-5 w-full"
          >
            Request to Book
          </Button>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            {date
              ? "You won't be charged yet · Free cancellation up to 24h"
              : "Pick a date to request this studio"}
          </p>
        </>
      )}
    </div>
  )
}