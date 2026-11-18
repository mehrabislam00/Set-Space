"use client"

import * as React from "react"

import { useAccountProfile } from "@/components/Dashboard/Account-profile-provider"
import {
  deleteMyNotification,
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NOTIFICATIONS_REFRESH_EVENT,
  type MarketplaceNotification,
} from "@/lib/Marketplace-api"
import type { NotificationItem } from "@/lib/Site-data"

type NotificationSnapshot = {
  userId: string
  status: "loading" | "ready" | "error"
  items: NotificationItem[]
  error: string | null
}

type NotificationsContextValue = {
  status: "loading" | "signed-out" | "ready" | "error"
  error: string | null
  items: NotificationItem[]
  unreadCount: number
  pendingIds: ReadonlySet<string>
  bulkPending: boolean
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  remove: (id: string) => Promise<void>
  refresh: () => void
  retry: () => void
}

const NotificationsContext =
  React.createContext<NotificationsContextValue | null>(null)
const EMPTY_NOTIFICATIONS: NotificationItem[] = []

function formatTime(createdAt: string) {
  const timestamp = new Date(createdAt).getTime()
  if (!Number.isFinite(timestamp)) return "Recently"

  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 1000)
  )
  if (elapsedSeconds < 60) return "Just now"
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}m ago`
  if (elapsedSeconds < 86400) return `${Math.floor(elapsedSeconds / 3600)}h ago`
  if (elapsedSeconds < 604800)
    return `${Math.floor(elapsedSeconds / 86400)}d ago`

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year:
      new Date(timestamp).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  }).format(timestamp)
}

function toNotificationItem(
  notification: MarketplaceNotification
): NotificationItem {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    href: notification.href,
    time: formatTime(notification.createdAt),
    unread: !notification.isRead,
  }
}

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { authLoading, userId } = useAccountProfile()
  const [snapshot, setSnapshot] = React.useState<NotificationSnapshot | null>(
    null
  )
  const [refreshCount, setRefreshCount] = React.useState(0)
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set())
  const pendingIdsRef = React.useRef(new Set<string>())
  const [bulkPending, setBulkPending] = React.useState(false)
  const bulkPendingRef = React.useRef(false)

  React.useEffect(() => {
    if (authLoading || !userId) return

    const controller = new AbortController()
    getMyNotifications(controller.signal)
      .then((notifications) => {
        if (controller.signal.aborted) return
        setSnapshot({
          userId,
          status: "ready",
          items: notifications.map(toNotificationItem),
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setSnapshot((current) => ({
          userId,
          status: "error",
          items: current?.userId === userId ? current.items : [],
          error:
            error instanceof Error
              ? error.message
              : "Could not load your notifications.",
        }))
      })

    return () => controller.abort()
  }, [authLoading, refreshCount, userId])

  React.useEffect(() => {
    if (authLoading || !userId) return

    const refresh = () => setRefreshCount((count) => count + 1)
    window.addEventListener(NOTIFICATIONS_REFRESH_EVENT, refresh)
    return () =>
      window.removeEventListener(NOTIFICATIONS_REFRESH_EVENT, refresh)
  }, [authLoading, userId])

  const activeSnapshot =
    !authLoading && userId && snapshot?.userId === userId ? snapshot : null
  const status: NotificationsContextValue["status"] = authLoading
    ? "loading"
    : !userId
      ? "signed-out"
      : (activeSnapshot?.status ?? "loading")

  const refresh = React.useCallback(() => {
    if (userId) setRefreshCount((count) => count + 1)
  }, [userId])

  const retry = React.useCallback(() => {
    if (!userId) return
    setSnapshot((current) =>
      current?.userId === userId ? { ...current, status: "loading" } : current
    )
    setRefreshCount((count) => count + 1)
  }, [userId])

  const markRead = React.useCallback(
    async (id: string) => {
      if (!userId || !activeSnapshot || activeSnapshot.status !== "ready") {
        throw new Error("Notifications are not ready yet.")
      }
      if (bulkPendingRef.current || pendingIdsRef.current.has(id)) return

      const notification = activeSnapshot.items.find((item) => item.id === id)
      if (!notification?.unread) return

      pendingIdsRef.current.add(id)
      setPendingIds((current) => new Set(current).add(id))
      setSnapshot((current) =>
        current?.userId === userId
          ? {
              ...current,
              items: current.items.map((item) =>
                item.id === id ? { ...item, unread: false } : item
              ),
            }
          : current
      )

      try {
        await markNotificationRead(id)
      } catch (error) {
        setSnapshot((current) =>
          current?.userId === userId
            ? {
                ...current,
                items: current.items.map((item) =>
                  item.id === id ? { ...item, unread: true } : item
                ),
              }
            : current
        )
        throw error
      } finally {
        pendingIdsRef.current.delete(id)
        setPendingIds((current) => {
          const next = new Set(current)
          next.delete(id)
          return next
        })
      }
    },
    [activeSnapshot, userId]
  )

  const markAllRead = React.useCallback(async () => {
    if (!userId || !activeSnapshot || activeSnapshot.status !== "ready") {
      throw new Error("Notifications are not ready yet.")
    }
    if (bulkPendingRef.current || pendingIdsRef.current.size > 0) return

    const previousItems = activeSnapshot.items
    bulkPendingRef.current = true
    setBulkPending(true)
    setSnapshot((current) =>
      current?.userId === userId
        ? {
            ...current,
            items: current.items.map((item) => ({ ...item, unread: false })),
          }
        : current
    )

    try {
      await markAllNotificationsRead()
    } catch (error) {
      const previousById = new Map(
        previousItems.map((item) => [item.id, item.unread])
      )
      setSnapshot((current) =>
        current?.userId === userId
          ? {
              ...current,
              items: current.items.map((item) =>
                previousById.has(item.id)
                  ? { ...item, unread: previousById.get(item.id) ?? false }
                  : item
              ),
            }
          : current
      )
      throw error
    } finally {
      bulkPendingRef.current = false
      setBulkPending(false)
    }
  }, [activeSnapshot, userId])

  const remove = React.useCallback(
    async (id: string) => {
      if (!userId || !activeSnapshot || activeSnapshot.status !== "ready") {
        throw new Error("Notifications are not ready yet.")
      }
      if (bulkPendingRef.current || pendingIdsRef.current.has(id)) return

      const previousIndex = activeSnapshot.items.findIndex(
        (item) => item.id === id
      )
      const notification = activeSnapshot.items[previousIndex]
      if (!notification) return

      pendingIdsRef.current.add(id)
      setPendingIds((current) => new Set(current).add(id))
      setSnapshot((current) =>
        current?.userId === userId
          ? {
              ...current,
              items: current.items.filter((item) => item.id !== id),
            }
          : current
      )

      try {
        await deleteMyNotification(id)
      } catch (error) {
        setSnapshot((current) => {
          if (current?.userId !== userId) return current
          if (current.items.some((item) => item.id === id)) return current
          const items = [...current.items]
          items.splice(Math.min(previousIndex, items.length), 0, notification)
          return { ...current, items }
        })
        throw error
      } finally {
        pendingIdsRef.current.delete(id)
        setPendingIds((current) => {
          const next = new Set(current)
          next.delete(id)
          return next
        })
      }
    },
    [activeSnapshot, userId]
  )

  const items = activeSnapshot?.items ?? EMPTY_NOTIFICATIONS
  const value = React.useMemo<NotificationsContextValue>(
    () => ({
      status,
      error: activeSnapshot?.error ?? null,
      items,
      unreadCount: items.filter((item) => item.unread).length,
      pendingIds,
      bulkPending,
      markRead,
      markAllRead,
      remove,
      refresh,
      retry,
    }),
    [
      activeSnapshot,
      bulkPending,
      items,
      markAllRead,
      markRead,
      pendingIds,
      refresh,
      remove,
      retry,
      status,
    ]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = React.useContext(NotificationsContext)
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider."
    )
  }
  return context
}
