"use client"

import { Bell, Moon, Plus, Sun } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import * as React from "react"

import logo from "@/assets/logo.svg"
import { Container } from "@/components/Container/Container"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

export function Navbar({ active = "Home" }: { active?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme !== "light"
  const [scrolled, setScrolled] = React.useState(false)

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
            <span className="block font-heading text-lg font-bold text-photo">
              Set<span className="text-primary">Space</span>
            </span>
            <span className="mt-1 block text-[10px] text-photo-muted">
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
                active === link.label
                  ? "border-primary text-primary"
                  : "text-photo"
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
            className="text-photo hover:bg-white/10 hover:text-photo"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative text-photo hover:bg-white/10 hover:text-photo"
          >
            <Bell className="size-4" />
            <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
              3
            </span>
          </Button>

          <Avatar className="size-8 border border-border bg-black/40">
            <AvatarFallback className="bg-transparent text-[10px] font-semibold text-photo">
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