import { CalendarClock, Camera, Check, Ruler, Users } from "lucide-react"

import { Reveal } from "@/components/Animation/Reveal"
import type { StudioDetail } from "@/lib/Site-data"
import { formatTaka } from "@/lib/utils"

/** Price, description, 4 quick-fact tiles, suitable-for list and house rules. */
export function StudioOverview({ studio }: { studio: StudioDetail }) {
  const facts = [
    { icon: Ruler, label: "Size", value: studio.size },
    { icon: Users, label: "Capacity", value: `${studio.capacity} guests` },
    { icon: CalendarClock, label: "Minimum", value: `${studio.minHours} hr` },
    { icon: Camera, label: "Type", value: studio.category },
  ]

  return (
    <section id="overview" className="scroll-mt-40">
      <Reveal>
        <p className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          {formatTaka(studio.price)}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
            / hour
          </span>
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {studio.description}
        </p>
      </Reveal>

      <Reveal delay={80} className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {facts.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-4 transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <Icon className="size-4 text-primary" strokeWidth={1.5} />
            <p className="mt-3 text-[11px] text-muted-foreground">{label}</p>
            <p className="mt-0.5 font-heading text-sm font-bold text-foreground">
              {value}
            </p>
          </div>
        ))}
      </Reveal>

      <Reveal delay={140} className="mt-9 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="font-heading text-sm font-bold text-foreground">
            Suitable for
          </h3>
          <ul className="mt-4 space-y-2.5">
            {studio.suitableFor.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-xs text-muted-foreground"
              >
                <Check className="size-3.5 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold text-foreground">
            Rules &amp; policies
          </h3>
          <ul className="mt-4 space-y-2.5">
            {studio.rules.map((rule) => (
              <li
                key={rule}
                className="flex items-center gap-2.5 text-xs text-muted-foreground"
              >
                <span className="size-1 shrink-0 rounded-full bg-primary" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
