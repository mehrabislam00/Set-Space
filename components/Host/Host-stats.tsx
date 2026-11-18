"use client"

import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"
import { hostStats } from "@/lib/Host-data"
import { MarketplaceApiError } from "@/lib/Marketplace-api"
import { formatTaka } from "@/lib/utils"
import { useHostDashboardStats } from "@/components/Host/Host-dashboard-stats-provider"

export function HostStats() {
  const { stats, loading, error, retry } = useHostDashboardStats()

  return (
    <section
      aria-label="Hosting summary"
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
            onClick={retry}
          >
            Try again
          </button>
        </p>
      )}
      {hostStats.map(({ label, key, icon: Icon }) => {
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
                    : key === "earnings"
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
