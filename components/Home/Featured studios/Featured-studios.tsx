import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { featuredStudios } from "@/lib/Site-data"
import { Container } from "../../Container/Container"
import { StudioCard } from "../../Studio card/Studio-card"
import { Reveal } from "@/components/Animation/Reveal"

export function FeaturedStudios() {
  return (
    <section className="bg-background py-16">
      <Container>
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
              Hand-picked this week
            </p>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-primary" />
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Featured Studios
              </h2>
            </div>
          </div>

          <Link
            href="/explore-studio"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "btn-alive rounded-full text-xs",
            })}
          >
            See all
          </Link>
        </Reveal>

        <Reveal delay={120} className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {featuredStudios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </Reveal>
      </Container>
    </section>
  )
}