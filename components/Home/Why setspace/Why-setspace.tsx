import Image from "next/image"

import studioLoft from "@/assets/studio-loft.jpg"

import { whyFeatures } from "@/lib/Site-data"
import { Container } from "@/components/Container/Container"

export function WhySetSpace() {
  return (
    <section className="bg-background py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Photo + host badge */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
          <Image
            src={studioLoft}
            alt="Brick & Shadow Loft studio with a leather armchair and softbox"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 rounded-xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-md">
            <p className="text-[10px] text-photo-muted">Verified host</p>
            <p className="mt-0.5 text-sm font-bold text-photo">
              Brick &amp; Shadow Loft · 4.9★
            </p>
          </div>
        </div>

        {/* Copy + features */}
        <div>
          <p className="mb-4 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
            Why SetSpace
          </p>
          <h2 className="max-w-md font-heading text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl">
            Spaces made for people who make things.
          </h2>

          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {whyFeatures.map(({ icon: Icon, title, description }) => (
              <div key={title}>
                <Icon className="size-5 text-primary" strokeWidth={1.5} />
                <dt className="mt-3 font-heading text-sm font-bold text-foreground">
                  {title}
                </dt>
                <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}