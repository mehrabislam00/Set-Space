import {
  CalendarCheck,
  CalendarX,
  Inbox,
  Pencil,
  Star,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { NotificationItem, NotificationType } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

const typeIcon: Record<NotificationType, LucideIcon> = {
  booking: CalendarCheck,
  request: Inbox,
  review: Star,
  cancelled: CalendarX,
  listing: Pencil,
}

type NotificationRowProps = {
  notification: NotificationItem
  onRead: () => void
  onDelete: () => void
}

/** One row of the Notifications page. Unread rows get a gold dot and a tinted background. */
export function NotificationRow({
  notification: n,
  onRead,
  onDelete,
}: NotificationRowProps) {
  const Icon = typeIcon[n.type]

  return (
    <li
      className={cn(
        "flex items-start gap-3 p-4 transition-colors duration-300 hover:bg-muted/40 sm:gap-4 sm:p-5",
        n.unread && "bg-primary/5"
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
        <Icon className="size-4" strokeWidth={1.5} />
      </span>

      <Link
        href={n.href}
        onClick={onRead}
        className="min-w-0 flex-1 rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <p className="flex items-center gap-2 font-heading text-sm font-bold text-foreground">
          {n.title}
          {n.unread && (
            <span
              aria-label="Unread"
              className="size-1.5 rounded-full bg-primary"
            />
          )}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {n.body}
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground/80">{n.time}</p>
      </Link>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {n.unread && (
          <button
            type="button"
            onClick={onRead}
            className="rounded text-[11px] font-semibold text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            Mark read
          </button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete notification: ${n.title}`}
          onClick={onDelete}
          className="btn-flat text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" strokeWidth={1.5} />
        </Button>
      </div>
    </li>
  )
}