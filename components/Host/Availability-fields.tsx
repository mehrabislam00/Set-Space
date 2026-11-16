"use client"

import * as React from "react"
import { MoonStar, Sunrise } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { TimePicker } from "@/components/Host/Time-picker"
import { UnavailableDatePicker } from "@/components/Host/Unavailable-date-picker"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

type Day = (typeof DAYS)[number]

type AvailabilityFieldsProps = {
  availableDays: string[]
  opens: string
  closes: string
  unavailableDate: string
  onToggleDay: (day: Day) => void
  onOpensChange: (value: string) => void
  onClosesChange: (value: string) => void
  onUnavailableDateChange: (value: string) => void
}

/** Availability section: weekday toggles, exact open/close times, blocked date. */
export function AvailabilityFields({
  availableDays,
  opens,
  closes,
  unavailableDate,
  onToggleDay,
  onOpensChange,
  onClosesChange,
  onUnavailableDateChange,
}: AvailabilityFieldsProps) {
  const selectedCount = availableDays.length

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <Label className="text-xs font-medium text-foreground">
            Available days
          </Label>
          <p
            aria-live="polite"
            className="text-[11px] text-muted-foreground"
          >
            {selectedCount === 0
              ? "Pick at least one day"
              : selectedCount === 7
                ? "Open every day"
                : `${selectedCount} of 7 days selected`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const isSelected = availableDays.includes(day)

            return (
              <button
                key={day}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggleDay(day)}
                className={cn(
                  "group relative h-10 min-w-14 overflow-hidden rounded-lg border px-3 text-sm font-medium outline-none transition-all duration-200 select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95 motion-reduce:transition-none",
                  isSelected
                    ? "border-primary/70 bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:brightness-105"
                    : "border-border bg-transparent text-muted-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                )}
              >
                <span className="relative z-10">{day}</span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-1.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary-foreground/70 transition-all duration-200 motion-reduce:transition-none",
                    isSelected ? "w-4 opacity-100" : "w-0 opacity-0"
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label
            htmlFor="opens"
            className="text-xs font-medium text-foreground"
          >
            <Sunrise aria-hidden className="size-3.5 text-primary" />
            Opens
          </Label>
          <TimePicker
            id="opens"
            title="Opening time"
            ariaLabel="Opening time"
            icon={<Sunrise className="size-4" />}
            value={opens}
            onChange={onOpensChange}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="closes"
            className="text-xs font-medium text-foreground"
          >
            <MoonStar aria-hidden className="size-3.5 text-muted-foreground" />
            Closes
          </Label>
          <TimePicker
            id="closes"
            title="Closing time"
            ariaLabel="Closing time"
            icon={<MoonStar className="size-4" />}
            value={closes}
            onChange={onClosesChange}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="unavailable-date"
            className="text-xs font-medium text-foreground"
          >
            Unavailable date
          </Label>
          <UnavailableDatePicker
            id="unavailable-date"
            value={unavailableDate}
            onChange={onUnavailableDateChange}
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Times are exact to the minute — choose any hour and minute.
      </p>
    </div>
  )
}
