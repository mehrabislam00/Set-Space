"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { notifications as initialNotifications } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

/** Bell button + dropdown. Pass the navbar's `ghost` classes as className. */
export function NotificationsMenu({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState(initialNotifications)

  const unread = items.filter((n) => n.unread).length

  // TODO: replace with API calls (mark one / mark all as read)
  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
            }
            className={cn("relative", className)}
          />
        }
      >
        <Bell className="size-4 origin-top transition-transform duration-300 group-hover:rotate-12" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={14}
        className="w-[360px] max-w-[calc(100vw-2rem)] gap-0 rounded-2xl border border-border bg-popover p-0 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Notifications
          </h2>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0}
            className="text-xs font-medium text-primary transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-40"
          >
            Mark all read
          </button>
        </div>

        {/* List */}
        {items.length > 0 ? (
          <ul className="max-h-[380px] divide-y divide-border overflow-y-auto [scrollbar-width:thin]">
            {items.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href}
                  onClick={() => {
                    markRead(n.id)
                    setOpen(false)
                  }}
                  className="relative block py-4 pr-5 pl-10 transition-colors duration-200 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                >
                  {n.unread && (
                    <span
                      aria-label="Unread"
                      className="absolute top-[23px] left-5 size-2 rounded-full bg-primary"
                    />
                  )}
                  <p className="font-heading text-sm font-bold text-foreground">
                    {n.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {n.body}
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground/80">
                    {n.time}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-12 text-center text-xs text-muted-foreground">
            You&apos;re all caught up.
          </p>
        )}

        {/* Footer */}
        <div className="border-t border-border">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block rounded-b-2xl py-3.5 text-center text-sm font-medium text-primary transition-colors duration-200 hover:bg-muted/60"
          >
            View all
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}