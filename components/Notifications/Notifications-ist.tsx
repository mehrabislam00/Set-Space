"use client"

import { BellOff, CheckCheck } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { notifications as initialNotifications } from "@/lib/Site-data"
import { cn } from "@/lib/utils"
import { NotificationRow } from "./Notification-item"


const filters = ["All", "Unread"] as const
type Filter = (typeof filters)[number]

/** Notifications page body (inside the dashboard layout): header, All/Unread switch, mark-all-read and the list. */
export function NotificationsList() {
  const [items, setItems] = React.useState(initialNotifications)
  const [filter, setFilter] = React.useState<Filter>("All")

  const unread = items.filter((n) => n.unread).length
  const visible = filter === "Unread" ? items.filter((n) => n.unread) : items
  const counts: Record<Filter, number> = { All: items.length, Unread: unread }

  // TODO: replace the three handlers below with API calls
  const markRead = (id: string) =>
    setItems((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  const markAllRead = () =>
    setItems((list) => list.map((n) => ({ ...n, unread: false })))
  const remove = (id: string) =>
    setItems((list) => list.filter((n) => n.id !== id))

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
            {unread > 0 ? `${unread} unread` : "You're all caught up"}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={unread === 0}
          onClick={markAllRead}
          className="btn-alive h-9 rounded-full px-3.5 text-[11px] font-semibold"
        >
          <CheckCheck className="size-3.5" />
          Mark all as read
        </Button>
      </header>

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
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
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
            {filter === "Unread" ? "No unread notifications" : "No notifications"}
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
          {visible.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onRead={() => markRead(n.id)}
              onDelete={() => remove(n.id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}