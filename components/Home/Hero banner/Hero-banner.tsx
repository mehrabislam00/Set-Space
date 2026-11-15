import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import heroImage from "@/assets/hero-studio.jpg"

import { buttonVariants } from "@/components/ui/button"
import { stats } from "@/lib/Site-data"
import { cn } from "@/lib/utils"
import { Container } from "@/components/Container/Container"
import { HowItWorksDialog } from "./How-it-works-dialog"
import { HomeSearch } from "./Home-search"

export function HeroBanner() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-background">
      {/* Background photo + darkening overlays */}
      <Image
        src={heroImage}
        alt="Photography studio with a cinema camera on a tripod"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/50" />

      <Container className="relative z-10 pt-24 pb-16">
        {/* 1. Heading + intro copy enter first */}
        <div className="stagger-in">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            The Creative Space Marketplace
          </p>

          <h1 className="font-heading text-5xl leading-[1.05] font-extrabold tracking-tight text-photo sm:text-6xl">
            Find Your Perfect
            <span className="block text-primary">Creative Space</span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-photo-muted">
            Rent premium studios for photography, filmmaking, podcasting, music
            production, and more.
          </p>
        </div>

        {/* 2. Hero actions next */}
        <div className="stagger-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "120ms" }}>
          <Link
            href="/explore-studio"
            className={cn(buttonVariants({ size: "lg" }), "btn-alive")}
          >
            Explore Studios
            <ArrowRight className="size-4" />
          </Link>
          <HowItWorksDialog />
        </div>

        {/* 3. Search bar after */}
        <HomeSearch />

        {/* 4. Stats last */}
        <dl
          className="stagger-in mt-8 flex flex-wrap gap-x-8 gap-y-2"
          style={{ animationDelay: "320ms" }}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <dt className="font-heading text-xl font-bold text-photo">
                {s.value}
              </dt>
              <dd className="text-xs text-photo-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}