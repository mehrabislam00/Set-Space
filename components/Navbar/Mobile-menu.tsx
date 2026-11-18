"use client"

import {
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  Heart,
  Inbox,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Plus,
  Settings,
  Sun,
  User,
  UserPlus,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import logo from "@/assets/logo.svg"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"
import { signOutCurrentUser, type SessionUser } from "@/lib/auth-client"
import { navLinks } from "@/lib/Site-data"
import { useSmoothTheme } from "@/lib/Use-smooth-theme"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const accountLinks = [
  { label: "My Profile", href: "/dashboard/profile", icon: User },
  { label: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
  { label: "Saved Studios", href: "/dashboard/saved-studios", icon: Heart },
  { label: "Host Dashboard", href: "/host", icon: Briefcase },
  { label: "Manage My Studios", href: "/host/my-studios", icon: Building2 },
  { label: "Booking Requests", href: "/host/bookings-request", icon: Inbox },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

/** Hamburger button + slide-in menu. Only visible below the `md` breakpoint.
 *  Pass the navbar's `ghost` classes as className. */
export function MobileMenu({
  user,
  loading = false,
  className,
}: {
  user: SessionUser | null
  loading?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [signingOut, setSigningOut] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, toggleTheme } = useSmoothTheme()
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const isDark = mounted ? resolvedTheme === "dark" : true

  const close = () => setOpen(false)
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  async function signOut() {
    if (signingOut) return
    setSigningOut(true)

    try {
      await signOutCurrentUser()
      close()
      toast.add({ title: "Signed out", type: "success" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast.add({
        title: "Could not sign out",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className={cn("md:hidden", className)}
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[85%] max-w-xs gap-0 p-0"
      >
        {/* Header */}
        <div className="relative flex h-24 shrink-0 items-center px-5">
          <Link href="/" onClick={close} className="flex items-center gap-2.5">
            <Image src={logo} alt="" className="size-9" />
            <span className="leading-none">
              <SheetTitle className="block font-heading text-lg font-bold">
                Set<span className="text-primary">Space</span>
              </SheetTitle>
              <span className="mt-1 block text-[10px] text-muted-foreground">
                Create. Rent. Inspire.
              </span>
            </span>
          </Link>

          <SheetClose
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Close menu"
                className="btn-flat absolute top-4 right-4 size-7 rounded-full border-primary text-primary hover:bg-accent hover:text-primary"
              />
            }
          >
            <X className="size-4" />
          </SheetClose>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-3 py-3.5 text-[15px] font-semibold transition-colors duration-200",
                        active
                          ? "bg-accent text-primary"
                          : "text-foreground hover:bg-muted/60 hover:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="mx-3 my-4 border-t border-border" />

          {loading ? (
            <div
              role="status"
              aria-label="Loading account"
              className="space-y-2 px-3 py-2"
            >
              <Skeleton className="h-4 w-24 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-36 motion-reduce:animate-none" />
            </div>
          ) : (
            <>
              <p className="px-3 pb-2 text-[11px] tracking-wide text-muted-foreground uppercase">
                {user ? user.name : "Account"}
              </p>
              <ul className="space-y-0.5">
                {user ? (
                  <>
                    {accountLinks.map(({ label, href, icon: Icon }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          onClick={close}
                          className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/60 hover:text-primary"
                        >
                          <Icon
                            className="size-4 text-primary"
                            strokeWidth={1.5}
                          />
                          {label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        type="button"
                        onClick={signOut}
                        disabled={signingOut}
                        className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors duration-200 hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <LogOut className="size-4" strokeWidth={1.5} />
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/login"
                        onClick={close}
                        className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/60 hover:text-primary"
                      >
                        <LogIn
                          className="size-4 text-primary"
                          strokeWidth={1.5}
                        />
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        onClick={close}
                        className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/60 hover:text-primary"
                      >
                        <UserPlus
                          className="size-4 text-primary"
                          strokeWidth={1.5}
                        />
                        Create Account
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </>
          )}
        </div>

        {/* Footer: theme + CTA */}
        <div className="shrink-0 border-t border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="btn-flat group size-9 rounded-full"
            >
              {isDark ? (
                <Sun className="size-4 transition-transform duration-500 group-hover:rotate-90" />
              ) : (
                <Moon className="size-4 transition-transform duration-500 group-hover:-rotate-12" />
              )}
            </Button>
          </div>

          <Button
            render={<Link href="/host/my-studios/add-studio" onClick={close} />}
            className="btn-alive mt-4 w-full"
            size="lg"
          >
            Add Studio
            <Plus className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
