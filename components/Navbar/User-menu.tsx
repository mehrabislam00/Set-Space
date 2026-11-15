"use client"

import {
  Briefcase,
  Building2,
  CalendarDays,
  Heart,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// TODO: replace with the signed-in user
const user = { name: "Alex Carter", email: "alex@example.com", initials: "AC" }

const groups = [
  [
    { label: "My Profile", href: "/dashboard/profile", icon: User },
    { label: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { label: "Saved Studios", href: "/dashboard/saved-studios", icon: Heart },
  ],
  [
    { label: "Host Dashboard", href: "/host/dashboard", icon: Briefcase },
    { label: "Manage My Studios", href: "/host/studios", icon: Building2 },
    { label: "Booking Requests", href: "/host/requests", icon: Inbox },
  ],
  [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
]

const itemClass =
  "gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium focus:bg-accent focus:text-accent-foreground"

/** Avatar button + account dropdown (desktop navbar).
 *  `scrolled` mirrors the navbar so the avatar matches the bar over the photo. */
export function UserMenu({
  scrolled,
  className,
}: {
  scrolled: boolean
  className?: string
}) {
  const router = useRouter()

  function signOut() {
    // TODO: clear the session with your auth provider first
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className={cn(
          "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <Avatar
          className={cn(
            "size-9 border transition-colors duration-300 hover:border-primary",
            scrolled
              ? "border-border bg-secondary"
              : "border-white/20 bg-black/40"
          )}
        >
          <AvatarFallback
            className={cn(
              "bg-transparent text-[11px] font-semibold",
              scrolled ? "text-foreground" : "text-photo"
            )}
          >
            {user.initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-64 rounded-xl border border-border p-2 shadow-2xl"
      >
        <div className="px-2.5 pt-2 pb-3">
          <p className="font-heading text-sm font-bold text-foreground">
            {user.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p>
        </div>

        {groups.map((group, i) => (
          <div key={i}>
            {i > 0 && <DropdownMenuSeparator className="my-1.5" />}
            {group.map(({ label, href, icon: Icon }) => (
              <DropdownMenuItem
                key={label}
                render={<Link href={href} />}
                className={itemClass}
              >
                <Icon className="size-4" strokeWidth={1.5} />
                {label}
              </DropdownMenuItem>
            ))}
          </div>
        ))}

        <DropdownMenuItem
          variant="destructive"
          onClick={signOut}
          className={itemClass}
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}