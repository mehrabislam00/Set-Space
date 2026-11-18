"use client"

import * as React from "react"
import { Clock3, Sun } from "lucide-react"

import {
  formatStudioTime,
  getCurrentStudioOpeningStatus,
  STUDIO_WEEKDAYS,
  type WeeklyOpeningHours,
} from "@/lib/Opening-hours"
import { cn } from "@/lib/utils"

function useBangladeshClock() {
  const [now, setNow] = React.useState<Date | null>(null)

  React.useEffect(() => {
    const update = () => setNow(new Date())
    update()
    const interval = window.setInterval(update, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  return now
}

function StatusLabel({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold",
        open ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          open ? "bg-success" : "bg-muted-foreground/60"
        )}
      />
      {open ? "Open Now" : "Closed Now"}
    </span>
  )
}

export function StudioHoursSummary({ hours }: { hours: WeeklyOpeningHours }) {
  const now = useBangladeshClock()
  const status = now ? getCurrentStudioOpeningStatus(hours, now) : null

  return (
    <div className="mt-3 flex min-h-10 items-center justify-between gap-3 border-t border-border pt-3">
      <div className="flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
        <Clock3 className="size-3.5 shrink-0 text-primary" aria-hidden />
        {status ? (
          status.today.closed ? (
            <span>Closed today</span>
          ) : (
            <span className="truncate">
              {formatStudioTime(status.today.opens)} –{" "}
              {formatStudioTime(status.today.closes)}
            </span>
          )
        ) : (
          <span>Loading today&apos;s hours…</span>
        )}
      </div>
      {status ? (
        <StatusLabel open={status.openNow} />
      ) : (
        <span className="shrink-0 text-[10px] text-muted-foreground">
          Checking
        </span>
      )}
    </div>
  )
}

export function StudioOpeningHours({ hours }: { hours: WeeklyOpeningHours }) {
  const now = useBangladeshClock()
  const status = now ? getCurrentStudioOpeningStatus(hours, now) : null

  return (
    <section
      id="opening-hours"
      className="scroll-mt-40 rounded-2xl border border-border bg-card p-5 sm:p-6"
      aria-labelledby="opening-hours-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="opening-hours-heading"
            className="font-heading text-lg font-bold text-foreground"
          >
            Opening Hours
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Weekly schedule · Bangladesh time
          </p>
        </div>
        {status ? (
          <StatusLabel open={status.openNow} />
        ) : (
          <span className="text-[11px] text-muted-foreground">
            Checking current status…
          </span>
        )}
      </div>

      <div className="mt-5 divide-y divide-border">
        {STUDIO_WEEKDAYS.map(({ key, label }) => {
          const day = hours[key]
          const isToday = status?.day === key

          return (
            <div
              key={key}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 text-xs sm:grid-cols-[minmax(0,1fr)_minmax(10rem,auto)_auto]",
                isToday && "rounded-lg bg-primary/5 px-3"
              )}
            >
              <span className="flex items-center gap-2 font-medium text-foreground">
                {isToday ? (
                  <Sun className="size-3.5 text-primary" aria-label="Today" />
                ) : (
                  <span className="size-3.5" aria-hidden />
                )}
                {label}
                {isToday && (
                  <span className="text-[10px] font-semibold text-primary">
                    Today
                  </span>
                )}
              </span>
              <span className="text-right text-muted-foreground sm:text-left">
                {day.closed
                  ? "Closed"
                  : `${formatStudioTime(day.opens)} – ${formatStudioTime(day.closes)}`}
              </span>
              <span
                className={cn(
                  "hidden text-right text-[10px] font-medium sm:block",
                  day.closed ? "text-muted-foreground" : "text-success"
                )}
              >
                {day.closed ? "Unavailable" : "Open"}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
