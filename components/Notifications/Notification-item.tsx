import {
  CalendarCheck,
  CalendarX,
  Check,
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

// Icon, label and status color for each notification type (colors come from theme.css).
const typeMeta: Record<
  NotificationType,
  { icon: LucideIcon; label: string; tone: string }
> = {
  booking: {
    icon: CalendarCheck,
    label: "Booking",
    tone: "bg-success/15 text-success",
  },
  request: {
    icon: Inbox,
    label: "Request",
    tone: "bg-primary/15 text-primary",
  },
  review: { icon: Star, label: "Review", tone: "bg-warning/15 text-warning" },
  cancelled: {
    icon: CalendarX,
    label: "Cancelled",
    tone: "bg-destructive/15 text-destructive",
  },
  listing: {
    icon: Pencil,
    label: "Listing",
    tone: "bg-olive/20 text-muted-foreground",
  },
}

type NotificationRowProps = {
  notification: NotificationItem
  busy: boolean
  onRead: () => void
  onDelete: () => void
}

/** One row of the Notifications page. Unread rows get a gold edge, a dot and a tinted background. */
export function NotificationRow({
  notification: n,
  busy,
  onRead,
  onDelete,
}: NotificationRowProps) {
  const { icon: Icon, label, tone } = typeMeta[n.type]

  return (
    <li
      aria-busy={busy}
      className={cn(
        "group relative flex items-start gap-3 p-4 transition-colors duration-300 hover:bg-muted/40 sm:gap-4 sm:p-5",
        n.unread &&
          "bg-primary/5 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary"
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none",
          tone
        )}
      >
        <Icon className="size-4.5" strokeWidth={1.5} />
      </span>

      <Link
        href={n.href}
        onClick={onRead}
        className="min-w-0 flex-1 rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="font-heading text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
            {n.title}
          </p>
          {n.unread && (
            <span
              aria-label="Unread"
              className="size-1.5 rounded-full bg-primary"
            />
          )}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {n.body}
        </p>
        <p className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground/80">
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {label}
          </span>
          {n.time}
        </p>
      </Link>

      <div className="flex shrink-0 items-center gap-1">
        {n.unread && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Mark as read: ${n.title}`}
            title="Mark as read"
            onClick={onRead}
            disabled={busy}
            className="btn-flat text-muted-foreground hover:text-primary"
          >
            <Check className="size-4" strokeWidth={1.5} />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete notification: ${n.title}`}
          title="Delete"
          onClick={onDelete}
          disabled={busy}
          className="btn-flat text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" strokeWidth={1.5} />
        </Button>
      </div>
    </li>
  )
}
