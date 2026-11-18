"use client"

import * as React from "react"
import { Clock, ChevronDown } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1)
const MINUTES = Array.from({ length: 60 }, (_, index) => index)

type Meridiem = "AM" | "PM"

type TimeParts = {
  hour: number
  minute: number
  meridiem: Meridiem
}

/** Parse the `"HH:mm"` value used by the form, falling back to 09:00 AM. */
function parseTime(value: string): TimeParts {
  const [rawHour, rawMinute] = value.split(":")
  const hour24 = Number(rawHour)
  const minute = Number(rawMinute)

  if (
    Number.isNaN(hour24) ||
    Number.isNaN(minute) ||
    hour24 < 0 ||
    hour24 > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return { hour: 9, minute: 0, meridiem: "AM" }
  }

  return {
    hour: hour24 % 12 || 12,
    minute,
    meridiem: hour24 < 12 ? "AM" : "PM",
  }
}

function toValue({ hour, minute, meridiem }: TimeParts) {
  const hour24 = (hour % 12) + (meridiem === "PM" ? 12 : 0)

  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

function toLabel({ hour, minute, meridiem }: TimeParts) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${meridiem}`
}

type TimePickerProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  title?: string
  ariaLabel?: string
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
}

/**
 * Popover time picker with free 1-12 hour, 00-59 minute and AM/PM selection.
 * Emits the same `"HH:mm"` 24-hour string the native time input produced.
 */
export function TimePicker({
  id,
  value,
  onChange,
  title = "Select time",
  ariaLabel,
  icon,
  className,
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const parts = parseTime(value)
  const hourRef = React.useRef<HTMLDivElement>(null)
  const minuteRef = React.useRef<HTMLDivElement>(null)

  // Center the current values when the popover opens.
  React.useEffect(() => {
    if (!open) return

    for (const column of [hourRef.current, minuteRef.current]) {
      const selected = column?.querySelector<HTMLElement>(
        '[data-selected="true"]'
      )
      if (!column || !selected) continue
      column.scrollTop =
        selected.offsetTop - column.clientHeight / 2 + selected.offsetHeight / 2
    }
  }, [open])

  function update(next: Partial<TimeParts>) {
    onChange(toValue({ ...parts, ...next }))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          "group flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 text-sm transition-all duration-200 outline-none hover:border-primary/60 hover:bg-primary/[0.03] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[popup-open]:border-primary/60 data-[popup-open]:ring-3 data-[popup-open]:ring-primary/15",
          className
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className="shrink-0 text-muted-foreground transition-colors duration-200 group-data-[popup-open]:text-primary"
          >
            {icon ?? <Clock className="size-4" />}
          </span>
          <span className="truncate font-medium text-foreground tabular-nums">
            {toLabel(parts)}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[popup-open]:rotate-180"
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-60 gap-0 overflow-hidden rounded-xl border border-border bg-popover p-0 shadow-xl ring-0"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-2.5">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {title}
          </p>
          <p className="font-heading text-sm font-bold text-primary tabular-nums">
            {toLabel(parts)}
          </p>
        </div>

        <div className="p-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="px-2 pb-1 text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                Hour
              </p>
              <div
                ref={hourRef}
                className="relative h-44 [scrollbar-width:thin] overflow-y-auto overscroll-contain rounded-lg bg-muted/30 p-1"
              >
                {HOURS.map((hour) => {
                  const selected = hour === parts.hour

                  return (
                    <button
                      key={hour}
                      type="button"
                      aria-pressed={selected}
                      data-selected={selected}
                      onClick={() => update({ hour })}
                      className={cn(
                        "flex h-8 w-full items-center justify-center rounded-md text-sm tabular-nums transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none",
                        selected
                          ? "bg-primary/15 font-bold text-primary"
                          : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
                      )}
                    >
                      {String(hour).padStart(2, "0")}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="px-2 pb-1 text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                Minute
              </p>
              <div
                ref={minuteRef}
                className="relative h-44 [scrollbar-width:thin] overflow-y-auto overscroll-contain rounded-lg bg-muted/30 p-1"
              >
                {MINUTES.map((minute) => {
                  const selected = minute === parts.minute

                  return (
                    <button
                      key={minute}
                      type="button"
                      aria-pressed={selected}
                      data-selected={selected}
                      onClick={() => update({ minute })}
                      className={cn(
                        "flex h-8 w-full items-center justify-center rounded-md text-sm tabular-nums transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none",
                        selected
                          ? "bg-primary/15 font-bold text-primary"
                          : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
                      )}
                    >
                      {String(minute).padStart(2, "0")}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1 rounded-lg bg-muted/40 p-1">
            {(["AM", "PM"] as const).map((meridiem) => {
              const selected = meridiem === parts.meridiem

              return (
                <button
                  key={meridiem}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update({ meridiem })}
                  className={cn(
                    "h-8 rounded-md text-xs font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none",
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                  )}
                >
                  {meridiem}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border/70 px-2.5 py-2">
          <p className="text-[10px] text-muted-foreground">
            Any hour or minute
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-1 text-xs font-semibold text-primary transition-colors duration-150 outline-none hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
