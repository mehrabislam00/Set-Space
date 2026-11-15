import { Star } from "lucide-react"
import Link from "next/link"

import { Reveal } from "@/components/Animation/Reveal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import type { StudioDetail } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

/** "Hosted by" card with a Contact Host button.
 *  Mobile: avatar + name on top, bio below, full-width button.
 *  sm and up: avatar | name + bio | button in one row. */
export function StudioHost({ host }: { host: StudioDetail["host"] }) {
  return (
    <section id="host" className="scroll-mt-40">
      <Reveal className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr_auto] sm:gap-x-5 sm:gap-y-0">
        <Avatar className="size-12 bg-secondary sm:row-span-2 sm:size-14">
          <AvatarFallback className="bg-transparent text-xs font-semibold text-muted-foreground">
            {host.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 sm:self-end">
          <p className="text-[10px] text-muted-foreground">Hosted by</p>
          <p className="font-heading text-base font-bold text-foreground">
            {host.name}
          </p>
          <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:gap-1.5">
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-primary text-primary" />
              {host.rating} host rating
            </span>
            <span aria-hidden className="hidden sm:inline">
              ·
            </span>
            <span>Member since {host.since}</span>
          </div>
        </div>

        <p className="col-span-2 text-xs leading-relaxed text-muted-foreground sm:col-span-1 sm:col-start-2 sm:mt-2 sm:max-w-md sm:self-start">
          {host.bio}
        </p>

        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "btn-alive col-span-2 w-full text-xs sm:col-span-1 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:w-auto sm:self-center"
          )}
        >
          Contact Host
        </Link>
      </Reveal>
    </section>
  )
}