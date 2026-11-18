"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { useNotifications } from "@/components/Notifications/Notifications-provider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { MarketplaceApiError } from "@/lib/Marketplace-api"

/** Bell button + dropdown. Pass the navbar's `ghost` classes as className. */
export function NotificationsMenu({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const {
    bulkPending,
    error,
    items,
    markAllRead,
    markRead,
    pendingIds,
    refresh,
    retry,
    status,
    unreadCount,
  } = useNotifications()

  function onOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen && (status === "ready" || status === "error")) refresh()
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

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
            className={cn("relative", className)}
          />
        }
      >
        <Bell className="size-4 origin-top transition-transform duration-300 group-hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={14}
        className="w-[360px] max-w-[calc(100vw-2rem)] gap-0 rounded-2xl border border-border bg-popover p-0 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Notifications
          </h2>
          <button
            type="button"
            onClick={() => void onMarkAllRead()}
            disabled={
              unreadCount === 0 ||
              bulkPending ||
              pendingIds.size > 0 ||
              status !== "ready"
            }
            aria-busy={bulkPending}
            className="text-xs font-medium text-primary transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-40"
          >
            Mark all read
          </button>
        </div>

        {status === "loading" ? (
          <div aria-busy="true" className="space-y-4 px-5 py-5">
            {[0, 1, 2].map((item) => (
              <div key={item} aria-hidden="true" className="space-y-2">
                <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
                <Skeleton className="h-3 w-full motion-reduce:animate-none" />
              </div>
            ))}
          </div>
        ) : status === "error" && items.length === 0 ? (
          <div role="alert" className="px-5 py-10 text-center">
            <p className="text-xs text-muted-foreground">
              {error || "Notifications could not be loaded."}
            </p>
            <button
              type="button"
              onClick={retry}
              className="mt-3 text-xs font-semibold text-primary underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        ) : items.length > 0 ? (
          <>
            {status === "error" && (
              <p role="alert" className="px-5 pt-3 text-xs text-destructive">
                {error || "Could not refresh notifications."}
              </p>
            )}
            <ul className="max-h-[380px] [scrollbar-width:thin] divide-y divide-border overflow-y-auto">
              {items.map((notification) => (
                <li key={notification.id}>
                  <Link
                    href={notification.href}
                    onClick={() => {
                      if (notification.unread) {
                        void onMarkRead(notification.id)
                      }
                      setOpen(false)
                    }}
                    className="relative block py-4 pr-5 pl-10 transition-colors duration-200 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                  >
                    {notification.unread && (
                      <span
                        aria-label="Unread"
                        className="absolute top-[23px] left-5 size-2 rounded-full bg-primary"
                      />
                    )}
                    <p className="font-heading text-sm font-bold text-foreground">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {notification.body}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground/80">
                      {notification.time}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="px-5 py-12 text-center text-xs text-muted-foreground">
            You&apos;re all caught up.
          </p>
        )}

        <div className="border-t border-border">
          <Link
            href="/dashboard/notifications"
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
