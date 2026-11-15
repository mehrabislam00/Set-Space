import { Star } from "lucide-react"
import Link from "next/link"

import { Reveal } from "@/components/Animation/Reveal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import type { StudioDetail } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

/** "Hosted by" card with a Contact Host button. */
export function StudioHost({ host }: { host: StudioDetail["host"] }) {
  return (
    <section id="host" className="scroll-mt-40">
      <Reveal className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-nowrap">
        <Avatar className="size-12 bg-secondary">
          <AvatarFallback className="bg-transparent text-xs font-semibold text-muted-foreground">
            {host.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-muted-foreground">Hosted by</p>
          <p className="font-heading text-sm font-bold text-foreground">
            {host.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="size-3 fill-primary text-primary" />
            {host.rating} host rating · Member since {host.since}
          </p>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
            {host.bio}
          </p>
        </div>

        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "btn-alive text-xs"
          )}
        >
          Contact Host
        </Link>
      </Reveal>
    </section>
  )
}