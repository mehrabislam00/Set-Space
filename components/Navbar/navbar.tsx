"use client"

import { Bell, Clapperboard, Moon, Plus, Sun } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { navLinks } from "@/lib/Site-data"

export function Navbar({ active = "Home" }: { active?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Clapperboard className="size-5" />
          </span>
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
      </div>
    </header>
  )
}