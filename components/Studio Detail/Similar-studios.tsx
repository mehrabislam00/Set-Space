import Link from "next/link"

import { Reveal } from "@/components/Animation/Reveal"
import { exploreStudios } from "@/lib/Site-data"
import { StudioCard } from "../Studio card/Studio-card"

type SimilarStudiosProps = {
  currentId: number
  category: string
}

/** Up to 3 other studios, same category first. Swap for a real query later. */
export function SimilarStudios({ currentId, category }: SimilarStudiosProps) {
  const others = exploreStudios.filter((s) => s.id !== currentId)
  const similar = [
    ...others.filter((s) => s.category === category),
    ...others.filter((s) => s.category !== category),
  ].slice(0, 3)

  return (
    <section className="mt-20">
      <Reveal className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-primary" />
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Similar Studios
          </h2>
        </div>
        <Link
          href="/explore-studio"
          className="btn-alive text-xs font-medium text-primary transition-opacity hover:opacity-80"
        >
          View more
        </Link>
      </Reveal>

      <Reveal delay={120} className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </Reveal>
    </section>
  )
}