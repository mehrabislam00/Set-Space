"use client"

import * as React from "react"

import { useAccountProfile } from "@/components/Dashboard/Account-profile-provider"
import {
  getMyWishlist,
  removeStudioFromWishlist,
  saveStudioToWishlist,
  type StudioRecord,
} from "@/lib/Marketplace-api"
import { toast } from "@/components/ui/toast"

type WishlistSnapshot = {
  userId: string
  status: "loading" | "ready" | "error"
  studioIds: string[]
  studios: StudioRecord[]
  error: string | null
}

type WishlistContextValue = {
  status: "loading" | "signed-out" | "ready" | "error"
  error: string | null
  authenticated: boolean
  studios: StudioRecord[]
  savedStudioIds: ReadonlySet<string>
  isPending: (studioId: string) => boolean
  toggleStudio: (studioId: string) => Promise<void>
  retry: () => void
}

const WishlistContext = React.createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { authLoading, userId } = useAccountProfile()
  const [snapshot, setSnapshot] = React.useState<WishlistSnapshot | null>(null)
  const [retryCount, setRetryCount] = React.useState(0)
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set())
  const pendingIdsRef = React.useRef(new Set<string>())

  React.useEffect(() => {
    if (authLoading) return
    if (!userId) return

    const controller = new AbortController()
    getMyWishlist(controller.signal)
      .then((studios) => {
        if (controller.signal.aborted) return
        setSnapshot({
          userId,
          status: "ready",
          studioIds: studios.map((studio) => studio.id),
          studios,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setSnapshot((current) => ({
          userId,
          status: "error",
          studioIds: current?.userId === userId ? current.studioIds : [],
          studios: current?.userId === userId ? current.studios : [],
          error:
            error instanceof Error
              ? error.message
              : "Could not load your saved studios.",
        }))
      })

    return () => controller.abort()
  }, [authLoading, retryCount, userId])

  const activeSnapshot =
    !authLoading && userId && snapshot?.userId === userId ? snapshot : null
  const status: WishlistContextValue["status"] = authLoading
    ? "loading"
    : !userId
      ? "signed-out"
      : (activeSnapshot?.status ?? "loading")

  const retry = React.useCallback(() => {
    if (!userId) return
    setSnapshot((current) =>
      current?.userId === userId ? { ...current, status: "loading" } : current
    )
    setRetryCount((count) => count + 1)
  }, [userId])

  const toggleStudio = React.useCallback(
    async (studioId: string) => {
      if (!userId || !activeSnapshot || activeSnapshot.status !== "ready") {
        throw new Error("Saved studios are not ready yet.")
      }
      if (pendingIdsRef.current.has(studioId)) return

      const wasSaved = activeSnapshot.studioIds.includes(studioId)
      const priorStudio = activeSnapshot.studios.find(
        (studio) => studio.id === studioId
      )
      const priorIndex = activeSnapshot.studioIds.indexOf(studioId)
      pendingIdsRef.current.add(studioId)
      setPendingIds((current) => new Set(current).add(studioId))

      setSnapshot((current) => {
        if (current?.userId !== userId || current.status !== "ready") {
          return current
        }
        return {
          ...current,
          studioIds: wasSaved
            ? current.studioIds.filter((id) => id !== studioId)
            : [...current.studioIds, studioId],
          studios: wasSaved
            ? current.studios.filter((studio) => studio.id !== studioId)
            : current.studios,
        }
      })

      try {
        if (wasSaved) {
          await removeStudioFromWishlist(studioId)
          toast.add({
            title: "Studio removed",
            description: "The studio was removed from your saved list.",
            type: "success",
          })
        } else {
          const studio = await saveStudioToWishlist(studioId)
          setSnapshot((current) => {
            if (current?.userId !== userId || current.status !== "ready") {
              return current
            }
            return {
              ...current,
              studios: [
                ...current.studios.filter((item) => item.id !== studioId),
                studio,
              ],
            }
          })
          toast.add({
            title: "Studio saved",
            description: "You can find it in your saved studios.",
            type: "success",
          })
        }
      } catch (error) {
        setSnapshot((current) => {
          if (current?.userId !== userId || current.status !== "ready") {
            return current
          }
          if (!wasSaved) {
            return {
              ...current,
              studioIds: current.studioIds.filter((id) => id !== studioId),
            }
          }

          const studioIds = current.studioIds.includes(studioId)
            ? current.studioIds
            : [
                ...current.studioIds.slice(0, Math.max(priorIndex, 0)),
                studioId,
                ...current.studioIds.slice(Math.max(priorIndex, 0)),
              ]

          return {
            ...current,
            studioIds,
            studios: priorStudio
              ? [
                  ...current.studios.filter((item) => item.id !== studioId),
                  priorStudio,
                ]
              : current.studios,
          }
        })
        throw error
      } finally {
        pendingIdsRef.current.delete(studioId)
        setPendingIds((current) => {
          const next = new Set(current)
          next.delete(studioId)
          return next
        })
      }
    },
    [activeSnapshot, userId]
  )

  const value = React.useMemo<WishlistContextValue>(
    () => ({
      status,
      error: activeSnapshot?.error ?? null,
      authenticated: Boolean(userId && !authLoading),
      studios: activeSnapshot?.studios ?? [],
      savedStudioIds: new Set(activeSnapshot?.studioIds ?? []),
      isPending: (studioId) => pendingIds.has(studioId),
      toggleStudio,
      retry,
    }),
    [
      activeSnapshot,
      authLoading,
      pendingIds,
      retry,
      status,
      toggleStudio,
      userId,
    ]
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = React.useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider.")
  }
  return context
}
