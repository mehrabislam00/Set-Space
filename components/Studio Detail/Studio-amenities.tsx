import { Reveal } from "@/components/Animation/Reveal"
import type { StudioDetail } from "@/lib/Site-data"

/** Amenity grid (icon + label). */
export function StudioAmenities({
  amenities,
}: {
  amenities: StudioDetail["amenities"]
}) {
  return (
    <section id="amenities" className="scroll-mt-40">
      <Reveal>
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
          Amenities
        </h2>
      </Reveal>

      <Reveal delay={80} className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {amenities.map(({ icon: Icon, label }) => (
          <div key={label} className="group flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-accent">
              <Icon className="size-4" strokeWidth={1.5} />
            </span>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}