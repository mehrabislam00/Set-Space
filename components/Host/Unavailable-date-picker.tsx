"use client"

import * as React from "react"
import { format, parseISO, startOfToday } from "date-fns"
import { CalendarDays, ChevronDown } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type UnavailableDatePickerProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

/** Single-date picker that keeps the form's `"yyyy-MM-dd"` value. */
export function UnavailableDatePicker({
  id,
  value,
  onChange,
  className,
}: UnavailableDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [direction, setDirection] = React.useState<"next" | "prev">("next")

  const selected = React.useMemo(() => {
    if (!value) return undefined

    const parsed = parseISO(value)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }, [value])

  const [month, setMonth] = React.useState<Date>(
    () => selected ?? startOfToday()
  )

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      setMonth(selected ?? startOfToday())
      setDirection("next")
    }
  }

  function handleMonthChange(next: Date) {
    setDirection(next > month ? "next" : "prev")
    setMonth(next)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        id={id}
        className={cn(
          "group flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-all duration-200 hover:border-primary/60 hover:bg-primary/[0.03] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:border-primary/60 data-[popup-open]:ring-3 data-[popup-open]:ring-primary/15",
          className
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarDays
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-colors duration-200 group-data-[popup-open]:text-primary"
          />
          <span
            className={cn(
              "truncate font-medium",
              selected ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {selected ? format(selected, "MMM d, yyyy") : "Pick a date"}
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
        className="w-auto gap-0 overflow-hidden rounded-xl border border-border bg-popover p-0 shadow-xl ring-0"
      >
        <div
          key={format(month, "yyyy-MM")}
          className={cn(
            "animate-in fade-in-0 duration-200 motion-reduce:animate-none",
            direction === "next"
              ? "slide-in-from-right-2"
              : "slide-in-from-left-2"
          )}
        >
          <Calendar
            mode="single"
            selected={selected}
            month={month}
            onMonthChange={handleMonthChange}
            onSelect={(date) => {
              if (!date) return
              onChange(format(date, "yyyy-MM-dd"))
              setOpen(false)
            }}
            disabled={{ before: startOfToday() }}
            className="p-3"
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/70 px-3 py-2">
          <button
            type="button"
            disabled={!selected}
            onClick={() => onChange("")}
            className="rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-1 py-0.5 text-xs font-semibold text-primary outline-none transition-colors duration-150 hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            Close
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
