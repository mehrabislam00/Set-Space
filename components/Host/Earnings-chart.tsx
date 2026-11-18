"use client"

import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"
import { useHostDashboardStats } from "@/components/Host/Host-dashboard-stats-provider"
import { MarketplaceApiError } from "@/lib/Marketplace-api"
import { cn, formatTaka } from "@/lib/utils"

const GRID_LINES = 4

/** Bar chart of completed-booking earnings for the last six months. */
export function EarningsChart() {
  const { stats, loading, error, retry } = useHostDashboardStats()
  const monthlyEarnings = stats?.monthlyEarnings ?? []
  const max = Math.max(...monthlyEarnings.map((month) => month.amount), 1)
  const hasEarnings = monthlyEarnings.some((month) => month.amount > 0)

  return (
    <section
      aria-labelledby="earnings-heading"
      aria-busy={loading}
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="earnings-heading"
          className="font-heading text-sm font-bold text-foreground"
        >
          Monthly earnings
        </h2>
        <p className="text-[11px] text-muted-foreground">
          Completed bookings · last 6 months
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive"
        >
          <p>{error.message}</p>
          {error instanceof MarketplaceApiError && error.status === 401 && (
            <Link href="/login" className="mr-3 underline">
              Sign in
            </Link>
          )}
          <button
            type="button"
            className="font-semibold underline underline-offset-2"
            onClick={retry}
          >
            Try again
          </button>
        </div>
      )}

      {loading && stats === null ? (
        <Skeleton className="mt-12 h-60 w-full motion-reduce:animate-none" />
      ) : error && stats === null ? null : !hasEarnings ? (
        <div className="mt-6 flex h-48 items-center justify-center rounded-xl border border-dashed border-border">
          <p className="text-xs text-muted-foreground">
            Completed booking earnings will appear here.
          </p>
        </div>
      ) : (
        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 flex h-48 flex-col justify-between"
          >
            {Array.from({ length: GRID_LINES }).map((_, index) => (
              <div
                key={index}
                className="border-t border-dashed border-border/60"
              />
            ))}
          </div>

          <ul className="group/chart relative grid grid-cols-6 gap-3 sm:gap-6">
            {monthlyEarnings.map(({ month, amount }, index) => {
              const previousMonth = monthlyEarnings[index - 1]
              const delta =
                previousMonth && previousMonth.amount > 0
                  ? Math.round(
                      ((amount - previousMonth.amount) / previousMonth.amount) *
                        100
                    )
                  : null

              return (
                <li
                  key={month}
                  tabIndex={0}
                  aria-label={`${month}: ${formatTaka(amount)}`}
                  className="group/bar flex cursor-default flex-col items-center gap-2 transition-opacity duration-300 outline-none group-hover/chart:opacity-40 hover:opacity-100! focus-visible:opacity-100! motion-reduce:transition-none"
                >
                  <div className="flex h-48 w-full items-end">
                    <div
                      className="bar-grow relative w-full rounded-t-lg bg-gradient-to-t from-primary/70 to-primary transition-[filter,translate,box-shadow] duration-300 group-hover/bar:-translate-y-1 group-hover/bar:shadow-[0_14px_30px_-10px_color-mix(in_srgb,var(--primary)_70%,transparent)] group-hover/bar:brightness-110 group-focus-visible/bar:-translate-y-1 group-focus-visible/bar:brightness-110 motion-reduce:transition-none"
                      style={{
                        height: `${amount > 0 ? Math.max((amount / max) * 100, 4) : 0}%`,
                        animationDelay: `${index * 70}ms`,
                      }}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-center whitespace-nowrap opacity-0 shadow-xl transition-[opacity,translate] duration-200 group-hover/bar:translate-y-0 group-hover/bar:opacity-100 group-focus-visible/bar:translate-y-0 group-focus-visible/bar:opacity-100"
                      >
                        <span className="block font-heading text-xs font-bold text-foreground">
                          {formatTaka(amount)}
                        </span>
                        {delta !== null && previousMonth && (
                          <span
                            className={cn(
                              "block text-[10px] font-medium",
                              delta >= 0 ? "text-success" : "text-destructive"
                            )}
                          >
                            {delta >= 0 ? "+" : ""}
                            {delta}% vs {previousMonth.month}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-muted-foreground transition-colors duration-300 group-hover/bar:text-primary group-focus-visible/bar:text-primary">
                    {month}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
