"use client"

import * as React from "react"
import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"
import { dashboardStats } from "@/lib/Dashboard-data"
import {
  DASHBOARD_STATS_REFRESH_EVENT,
  getMyStats,
  MarketplaceApiError,
  type MarketplaceDashboardStats,
} from "@/lib/Marketplace-api"
import { formatTaka } from "@/lib/utils"

export function StatsCards() {
  const [stats, setStats] = React.useState<
    MarketplaceDashboardStats["renter"] | null
  >(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(() => {
    const controller = new AbortController()

    getMyStats(controller.signal)
      .then((result) => setStats(result.renter))
      .catch((loadError: unknown) => {
        if (loadError instanceof Error && loadError.name === "AbortError")
          return
        setError(
          loadError instanceof Error
            ? loadError
            : new Error("Could not load your account summary.")
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  React.useEffect(() => {
    const refresh = () => {
      setLoading(true)
      setError(null)
      setReloadKey((key) => key + 1)
    }

    window.addEventListener(DASHBOARD_STATS_REFRESH_EVENT, refresh)
    return () =>
      window.removeEventListener(DASHBOARD_STATS_REFRESH_EVENT, refresh)
  }, [])

  return (
    <section
      aria-label="Account summary"
      aria-busy={loading}
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {error && (
        <p role="alert" className="col-span-full text-xs text-destructive">
          {error.message}{" "}
          {error instanceof MarketplaceApiError && error.status === 401 && (
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>
          )}{" "}
          <button
            type="button"
            className="font-semibold underline underline-offset-2"
            onClick={() => {
              setLoading(true)
              setError(null)
              setReloadKey((key) => key + 1)
            }}
          >
            Try again
          </button>
        </p>
      )}
      {dashboardStats.map(({ label, key, icon: Icon }) => {
        const value = stats?.[key]

        return (
          <div
            key={label}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:gap-4 sm:p-5"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary sm:size-12">
              <Icon
                className="size-5 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] text-muted-foreground">
                {label}
              </p>
              {loading && stats === null ? (
                <Skeleton className="mt-1 h-7 w-14 motion-reduce:animate-none" />
              ) : (
                <p className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                  {value === undefined
                    ? "—"
                    : key === "totalSpent"
                      ? formatTaka(value)
                      : value}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}
