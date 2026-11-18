"use client"

import * as React from "react"
import { MoonStar, Sunrise } from "lucide-react"

import { TimePicker } from "@/components/Host/Time-picker"
import { UnavailableDatePicker } from "@/components/Host/Unavailable-date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  STUDIO_WEEKDAYS,
  type DailyOpeningHours,
  type StudioWeekday,
  type WeeklyOpeningHours,
} from "@/lib/Opening-hours"

type AvailabilityFieldsProps = {
  openingHours: WeeklyOpeningHours
  unavailableDate: string
  validationError?: string | null
  onDayChange: (day: StudioWeekday, hours: DailyOpeningHours) => void
  onUnavailableDateChange: (value: string) => void
}

/** Weekly opening schedule and the existing one-off unavailable date control. */
export function AvailabilityFields({
  openingHours,
  unavailableDate,
  validationError,
  onDayChange,
  onUnavailableDateChange,
}: AvailabilityFieldsProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-medium text-foreground">Weekly schedule</p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Set separate hours for each day. Closing must be later than opening;
          overnight hours are not supported.
        </p>
      </div>

      <div className="space-y-2.5">
        {STUDIO_WEEKDAYS.map(({ key, label }) => {
          const hours = openingHours[key]

          return (
            <div
              key={key}
              className="grid gap-3 rounded-xl border border-border bg-card/40 p-3 sm:grid-cols-[minmax(5.5rem,0.7fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center"
            >
              <Label className="font-heading text-xs font-semibold text-foreground">
                {label}
              </Label>

              <div className="space-y-1.5">
                <Label
                  htmlFor={`opens-${key}`}
                  className="text-[10px] text-muted-foreground"
                >
                  Opens
                </Label>
                <TimePicker
                  id={`opens-${key}`}
                  title={`${label} opening time`}
                  ariaLabel={`${label} opening time`}
                  icon={<Sunrise className="size-4" />}
                  value={hours.opens}
                  disabled={hours.closed}
                  onChange={(opens) => onDayChange(key, { ...hours, opens })}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor={`closes-${key}`}
                  className="text-[10px] text-muted-foreground"
                >
                  Closes
                </Label>
                <TimePicker
                  id={`closes-${key}`}
                  title={`${label} closing time`}
                  ariaLabel={`${label} closing time`}
                  icon={<MoonStar className="size-4" />}
                  value={hours.closes}
                  disabled={hours.closed}
                  onChange={(closes) => onDayChange(key, { ...hours, closes })}
                />
              </div>

              <label className="group flex cursor-pointer items-center gap-2 text-xs text-muted-foreground sm:justify-end">
                <Checkbox
                  checked={hours.closed}
                  onCheckedChange={(checked) =>
                    onDayChange(key, { ...hours, closed: checked === true })
                  }
                  aria-label={`Closed on ${label}`}
                />
                <span>Closed</span>
              </label>
            </div>
          )
        })}
      </div>

      {validationError ? (
        <p role="alert" className="text-xs text-destructive">
          {validationError}
        </p>
      ) : null}

      <div className="max-w-sm space-y-2">
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
  )
}
