"use client"

import { Bell, Moon, Plus, Sun } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import logo from "@/assets/logo.svg"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"

import { navLinks } from "@/lib/Site-data"
import { cn } from "@/lib/utils"
import { Container } from "../Container/Container"
import { useSmoothTheme } from "@/lib/Use-smooth-theme"

export function Navbar({ active = "Home" }: { active?: string }) {
  const { resolvedTheme, toggleTheme } = useSmoothTheme()
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const [scrolled, setScrolled] = React.useState(false)
  const isDark = mounted ? resolvedTheme === "dark" : true

  // Over the photo (top of page) text is always light.
  // After scrolling the bar gets the page background, so text follows the theme.
  const fg = scrolled ? "text-foreground" : "text-photo"
  const fgMuted = scrolled ? "text-muted-foreground" : "text-photo-muted"
  const ghost = scrolled
    ? "btn-flat group text-foreground hover:bg-accent hover:text-foreground"
    : "btn-flat group text-photo hover:bg-white/10 hover:text-photo"

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
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-6">
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
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "border-b-2 border-transparent pb-0.5 text-xs font-medium transition-colors hover:text-primary",
                active === link.label ? "border-primary text-primary" : fg
              )}
            >
              {link.label}
            </Link>
          ))}
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

          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className={cn("relative", ghost)}
          >
            <Bell className="size-4 origin-top transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
              3
            </span>
          </Button>

          <Avatar
            className={cn(
              "size-8 border",
              scrolled
                ? "border-border bg-secondary"
                : "border-white/20 bg-black/40"
            )}
          >
            <AvatarFallback
              className={cn("bg-transparent text-[10px] font-semibold", fg)}
            >
              AC
            </AvatarFallback>
          </Avatar>

          <Button size="sm" className="ml-1 hidden text-xs sm:inline-flex">
            Add Studio
            <Plus className="size-3.5" />
          </Button>
        </div>
      </Container>
    </header>
  )
}