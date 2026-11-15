"use client"

import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  dashboardNav,
  dashboardUser,
  type NavItem,
} from "@/lib/Dashboard-data"
import { cn } from "@/lib/utils"
import { SwitchIcon } from "./Switch-icon"

const itemClass =
  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring"

type DashboardSidebarProps = {
  user?: { name: string; email: string; initials: string }
  nav?: NavItem[]
  switchLink?: { label: string; href: string }
}

/** Account sidebar, shared by the renter dashboard and the host dashboard.
 *  Stacks above the content on mobile, with the nav as a scrollable row.
 *  The blocks fade up on mount, so switching between the two dashboards feels alive. */
export function DashboardSidebar({
  user = dashboardUser,
  nav = dashboardNav,
  switchLink = { label: "Switch to Hosting", href: "/host" },
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [switching, setSwitching] = React.useState(false)

  // the longest matching href wins, so "/host/my-studios/add-studio"
  // highlights "Add Studio" and not "My Studios"
  const activeHref = nav
    .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <aside className="lg:sticky lg:top-28 lg:w-54 lg:shrink-0 lg:self-start">
      <div className="stagger-in flex items-center gap-3">
        <Avatar className="size-11 border border-primary/40 bg-secondary">
          <AvatarFallback className="bg-transparent text-xs font-semibold text-primary">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold text-foreground">
            {user.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>

      <Link
        href={switchLink.href}
        onClick={() => setSwitching(true)}
        className={cn(
          "btn-alive group stagger-in mt-4 flex h-9 w-full items-center justify-between rounded-xl border border-primary/50 px-3 text-[11px] font-semibold text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10",
          switching && "border-primary bg-primary/15"
        )}
        style={{ animationDelay: "80ms" }}
      >
        {switchLink.label}
        <SwitchIcon switching={switching} className="size-4 overflow-visible" />
      </Link>

      <nav
        aria-label="Dashboard"
        className="-mx-5 mt-5 flex gap-1 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {nav.map(({ label, href, icon: Icon, badge }, i) => {
          const active = href === activeHref

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                itemClass,
                "group stagger-in",
                active
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              style={{ animationDelay: `${160 + i * 45}ms` }}
            >
              <Icon
                className="size-4 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
              {label}
              {!!badge && (
                <span className="ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {badge}
                </span>
              )}
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
            "group stagger-in text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          )}
          style={{ animationDelay: `${160 + nav.length * 45}ms` }}
        >
          <LogOut
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={1.5}
          />
          Sign Out
        </button>
      </nav>
    </aside>
  )
}