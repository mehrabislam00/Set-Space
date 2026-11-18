"use client"

import { BellOff, CheckCheck } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { MarketplaceApiError } from "@/lib/Marketplace-api"
import { useNotifications } from "@/components/Notifications/Notifications-provider"
import { cn } from "@/lib/utils"
import { NotificationRow } from "./Notification-item"

const filters = ["All", "Unread"] as const
type Filter = (typeof filters)[number]

/** Notifications page body (inside the dashboard layout). */
export function NotificationsList() {
  const {
    bulkPending,
    error,
    items,
    markAllRead,
    markRead,
    pendingIds,
    remove,
    retry,
    status,
    unreadCount,
  } = useNotifications()
  const [filter, setFilter] = React.useState<Filter>("All")

  const visible = filter === "Unread" ? items.filter((n) => n.unread) : items
  const counts: Record<Filter, number> = {
    All: items.length,
    Unread: unreadCount,
  }

  async function onMarkRead(id: string) {
    try {
      await markRead(id)
    } catch (requestError) {
      if (!(requestError instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    }
  }

  async function onMarkAllRead() {
    try {
      await markAllRead()
    } catch (requestError) {
      if (!(requestError instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    }
  }

  async function onDelete(id: string) {
    try {
      await remove(id)
    } catch (requestError) {
      if (!(requestError instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    }
  }

  return (
    <section aria-labelledby="notifications-heading">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="notifications-heading"
            className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
          >
            Notifications
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {status === "loading"
              ? "Loading your updates"
              : unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
          </p>
        </div>

        {status === "ready" && (
          <Button
            type="button"
            variant="outline"
            disabled={unreadCount === 0 || bulkPending || pendingIds.size > 0}
            aria-busy={bulkPending}
            onClick={() => void onMarkAllRead()}
            className="btn-alive h-9 rounded-full px-3.5 text-[11px] font-semibold"
          >
            <CheckCheck className="size-3.5" />
            Mark all as read
          </Button>
        )}
      </header>

      {status === "loading" ? (
        <ul
          aria-busy="true"
          className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card"
        >
          {[0, 1, 2].map((item) => (
            <li key={item} aria-hidden="true" className="space-y-3 p-5">
              <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-full motion-reduce:animate-none" />
              <Skeleton className="h-3 w-24 motion-reduce:animate-none" />
            </li>
          ))}
        </ul>
      ) : status === "signed-out" ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="font-heading text-base font-bold text-foreground">
            Sign in to view notifications
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Booking updates and reviews will appear here.
          </p>
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg" }), "btn-alive mt-5")}
          >
            Sign in
          </Link>
        </div>
      ) : status === "error" && items.length === 0 ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
        >
          <p className="text-sm text-foreground">
            {error || "Notifications could not be loaded."}
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 text-xs font-semibold text-primary underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {status === "error" && (
            <div
              role="alert"
              className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3"
            >
              <p className="text-xs text-foreground">
                {error || "Could not refresh notifications."}
              </p>
              <button
                type="button"
                onClick={retry}
                className="text-xs font-semibold text-primary underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          )}

          <div
            role="group"
            aria-label="Filter notifications"
            className="mt-6 flex w-fit rounded-full border border-border p-1"
          >
            {filters.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                  filter === name
                    ? "bg-accent text-primary"
                    : "text-foreground hover:text-primary"
                )}
              >
                {name}
                <span
                  className={cn(
                    "min-w-4.5 rounded-full px-1 text-center text-[10px] leading-4.5 font-semibold",
                    filter === name
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {counts[name]}
                </span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                <BellOff className="size-5" strokeWidth={1.5} />
              </span>
              <p className="mt-4 font-heading text-base font-bold text-foreground">
                {filter === "Unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                New booking updates and reviews will show up here.
              </p>
            </div>
          ) : (
            <ul
              key={filter}
              className="stagger-in mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card"
            >
              {visible.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  busy={bulkPending || pendingIds.has(notification.id)}
                  onRead={() => void onMarkRead(notification.id)}
                  onDelete={() => void onDelete(notification.id)}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
