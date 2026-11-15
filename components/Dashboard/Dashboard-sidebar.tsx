"use client"

import { ArrowLeftRight, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { dashboardNav, dashboardUser } from "@/lib/Dashboard-data"
import { cn } from "@/lib/utils"

const itemClass =
  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring"

/** Account sidebar. Stacks above the content on mobile, with the nav as a scrollable row. */
export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="lg:sticky lg:top-28 lg:w-54 lg:shrink-0 lg:self-start">
      <div className="flex items-center gap-3">
        <Avatar className="size-11 border border-primary/40 bg-secondary">
          <AvatarFallback className="bg-transparent text-xs font-semibold text-primary">
            {dashboardUser.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold text-foreground">
            {dashboardUser.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {dashboardUser.email}
          </p>
        </div>
      </div>

      <Link
        href="/host/dashboard"
        className="btn-alive mt-4 flex h-9 w-full items-center justify-between rounded-xl border border-primary/50 px-3 text-[11px] font-semibold text-primary transition-colors duration-200 hover:bg-primary/10"
      >
        Switch to Hosting
        <ArrowLeftRight className="size-3.5" />
      </Link>

      <nav
        aria-label="Dashboard"
        className="-mx-5 mt-5 flex gap-1 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {dashboardNav.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/dashboard" ? pathname === href : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                itemClass,
                active
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" strokeWidth={1.5} />
              {label}
            </Link>
          )
        })}

        <button
          type="button"
          onClick={() => {
            // TODO: call your sign-out action
          }}
          className={cn(
            itemClass,
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          )}
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          Sign Out
        </button>
      </nav>
    </aside>
  )
}