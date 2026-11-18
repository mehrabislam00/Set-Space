"use client"

import * as React from "react"

import {
  DASHBOARD_STATS_REFRESH_EVENT,
  getMyStats,
  type MarketplaceDashboardStats,
} from "@/lib/Marketplace-api"

type HostDashboardStats = MarketplaceDashboardStats["host"]

type HostDashboardStatsContextValue = {
  stats: HostDashboardStats | null
  loading: boolean
  error: Error | null
  retry: () => void
}

const HostDashboardStatsContext =
  React.createContext<HostDashboardStatsContextValue | null>(null)

export function HostDashboardStatsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [stats, setStats] = React.useState<HostDashboardStats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(() => {
    const controller = new AbortController()

    getMyStats(controller.signal)
      .then((result) => setStats(result.host))
      .catch((loadError: unknown) => {
        if (loadError instanceof Error && loadError.name === "AbortError")
          return
        setError(
          loadError instanceof Error
            ? loadError
            : new Error("Could not load host dashboard stats.")
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

  const retry = React.useCallback(() => {
    setLoading(stats === null)
    setError(null)
    setReloadKey((key) => key + 1)
  }, [stats])

  return (
    <HostDashboardStatsContext.Provider
      value={{ stats, loading, error, retry }}
    >
      {children}
    </HostDashboardStatsContext.Provider>
  )
}

export function useHostDashboardStats() {
  const context = React.useContext(HostDashboardStatsContext)
  if (!context) {
    throw new Error(
      "useHostDashboardStats must be used within a HostDashboardStatsProvider."
    )
  }
  return context
}
