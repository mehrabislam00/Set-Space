import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


import { disciplines } from "@/lib/Site-data"
import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"

export function CategoriesSection() {
  return (
    <section className="bg-background py-20">
      <Container>
        {/* Heading */}
        <Reveal className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-primary" />
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Browse by Creative Discipline
            </h2>
          </div>

          <Link
            href="/studios"
            className="btn-alive flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-80"
          >
            View All
            <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>

        {/* Cards */}
        <Reveal delay={120} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {disciplines.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                <div className="min-w-0">
                  <h3 className="text-[13px] leading-tight font-bold text-photo">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 truncate text-[10px] text-photo-muted">
                    {item.description}
                  </p>
                </div>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-photo/40 text-photo transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}