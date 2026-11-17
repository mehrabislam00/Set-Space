"use client"

import { Moon, Plus, Sun } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import logo from "@/assets/logo.svg"

import { Button } from "@/components/ui/button"

import { authClient } from "@/lib/auth-client"
import { navLinks, solidNavRoutes } from "@/lib/Site-data"
import { cn } from "@/lib/utils"
import { Container } from "../Container/Container"
import { MobileMenu } from "./Mobile-menu"

import { UserMenu } from "./User-menu"
import { useSmoothTheme } from "@/lib/Use-smooth-theme"
import { usePathname } from "next/navigation"
import { NotificationsMenu } from "../Notifications/Notifications-menu"

export function Navbar() {
  const { resolvedTheme, toggleTheme } = useSmoothTheme()
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user ?? null
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const [scrolled, setScrolled] = React.useState(false)
  const isDark = mounted ? resolvedTheme === "dark" : true

  // Pages without a hero photo (dashboard, host...) always use the solid look.
  const solid =
    scrolled || solidNavRoutes.some((route) => pathname.startsWith(route))

  // Over the photo (top of a hero page) text is always light.
  // On solid pages the bar gets the page background, so text follows the theme.
  const fg = solid ? "text-foreground" : "text-photo"
  const fgMuted = solid ? "text-muted-foreground" : "text-photo-muted"
  const ghost = solid
    ? "btn-flat group text-foreground hover:bg-accent hover:text-foreground"
    : "btn-flat group text-photo hover:bg-white/10 hover:text-photo"

  // ---- sliding active indicator ----------------------------------------
  const navRef = React.useRef<HTMLElement>(null)
  const itemRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({})
  const [indicator, setIndicator] = React.useState<{
    x: number
    w: number
    visible: boolean
  }>({ x: 0, w: 0, visible: false })
  const previousPathname = React.useRef(pathname)
  const initialMeasureComplete = React.useRef(false)

  const isActive = React.useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname]
  )

  const measureIndicator = React.useCallback(() => {
    const active = navLinks.find((link) => isActive(link.href))
    const el = active ? itemRefs.current[active.href] : null

    if (!el || el.offsetWidth === 0) {
      return
    }

    setIndicator({
      x: el.offsetLeft,
      w: el.offsetWidth,
      visible: true,
    })
  }, [isActive])

  // Establish the initial position before the first paint. This prevents a
  // flash at x=0 while still allowing later route changes to animate.
  React.useLayoutEffect(() => {
    if (initialMeasureComplete.current) {
      return
    }

    initialMeasureComplete.current = true
    measureIndicator()
  }, [measureIndicator])

  React.useEffect(() => {
    if (previousPathname.current === pathname) {
      return
    }

    previousPathname.current = pathname
    const frame = window.requestAnimationFrame(measureIndicator)
    return () => window.cancelAnimationFrame(frame)
  }, [measureIndicator, pathname])

  React.useEffect(() => {
    window.addEventListener("resize", measureIndicator)
    return () => window.removeEventListener("resize", measureIndicator)
  }, [measureIndicator])
  // ----------------------------------------------------------------------

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        solid
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-3 sm:gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={logo} alt="SetSpace logo" priority className="size-9" />
          <span className="leading-none">
            <span className={cn("block font-heading text-lg font-bold", fg)}>
              Set<span className="text-primary">Space</span>
            </span>
            <span className={cn("mt-1 block text-[10px]", fgMuted)}>
              Create. Rent. Inspire.
            </span>
          </span>
        </Link>

        {/* Links */}
        <nav
          ref={navRef}
          className="relative hidden items-center gap-7 md:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.label}
                href={link.href}
                ref={(el) => {
                  itemRefs.current[link.href] = el
                }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-xs font-medium transition-colors duration-300 hover:text-primary motion-reduce:transition-none",
                  active ? "text-primary" : fg
                )}
              >
                {link.label}
              </Link>
            )
          })}

          {/* One continuous gold bar that slides between items */}
          <span
            aria-hidden
            className={cn(
              "absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none",
              indicator.visible ? "opacity-100" : "opacity-0"
            )}
            style={{
              width: `${indicator.w}px`,
              transform: `translateX(${indicator.x}px)`,
            }}
          />
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className={ghost}
            onClick={toggleTheme}
          >
            {isDark ? (
              <Sun className="size-4 transition-transform duration-500 group-hover:rotate-90" />
            ) : (
              <Moon className="size-4 transition-transform duration-500 group-hover:-rotate-12" />
            )}
          </Button>

          {isPending ? (
            <span
              aria-hidden
              className="hidden animate-pulse items-center gap-2 sm:flex"
            >
              <span className="size-8 rounded-full bg-foreground/10" />
              <span className="size-9 rounded-full bg-foreground/10" />
            </span>
          ) : user ? (
            <>
              <NotificationsMenu className={ghost} />
              <UserMenu
                user={user}
                scrolled={solid}
                className="hidden sm:block"
              />
            </>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className={cn(ghost, "ml-1 text-xs font-semibold")}
              >
                Sign In
              </Button>
            </Link>
          )}

          <Link href="/host/my-studios/add-studio">
            <Button size="sm" className="ml-1 hidden text-xs sm:inline-flex">
              Add Studio
              <Plus className="size-3.5" />
            </Button>
          </Link>

          <MobileMenu user={user} className={ghost} />
        </div>
      </Container>
    </header>
  )
}
