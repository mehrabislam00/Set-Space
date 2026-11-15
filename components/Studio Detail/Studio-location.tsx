import { ArrowUpRight, MapPin } from "lucide-react"

import { Reveal } from "@/components/Animation/Reveal"

/** Location block. Exact address is shared after the host confirms a booking. */
export function StudioLocation({ location }: { location: string }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`

  return (
    <section id="location" className="scroll-mt-40">
      <Reveal>
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
          Location
        </h2>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
              <MapPin className="size-4.5" />
            </span>
            <div>
              <p className="font-heading text-sm font-bold text-foreground">
                {location}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                The exact address is shared once your booking is confirmed.
              </p>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-alive group flex items-center gap-1 text-xs font-medium text-primary"
          >
            View on map
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </Reveal>
    </section>
  )
}