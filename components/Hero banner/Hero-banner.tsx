import { ArrowRight, CalendarDays, Play, Search } from "lucide-react"
import Image from "next/image"

import heroImage from "@/assets/hero-studio.jpg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { categories, stats } from "@/lib/Site-data"


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

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-24 pb-16">
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

        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg">
            Explore Studios
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/15 bg-black/30 text-photo hover:bg-white/10 hover:text-photo"
          >
            <Play className="size-3.5 fill-current" />
            How It Works
          </Button>
        </div>

        {/* Search bar */}
        <form className="mt-12 flex max-w-3xl flex-col gap-2 rounded-xl border border-white/10 bg-black/50 p-2 backdrop-blur-md md:flex-row md:items-center md:gap-0">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
            <Input
              placeholder="Search studios or cities..."
              className="h-10 border-0 bg-transparent pl-9 text-photo shadow-none placeholder:text-photo-muted/70 focus-visible:ring-0 dark:bg-transparent"
            />
          </div>

          <div className="hidden h-8 w-px bg-white/10 md:block" />

          <NativeSelect
            aria-label="Category"
            className="h-10 w-full border-0 bg-transparent text-photo shadow-none focus-visible:ring-0 md:w-44 dark:bg-transparent"
          >
            {categories.map((c) => (
              <NativeSelectOption key={c} value={c}>
                {c}
              </NativeSelectOption>
            ))}
          </NativeSelect>

          <div className="hidden h-8 w-px bg-white/10 md:block" />

          <div className="relative md:w-48">
            <CalendarDays className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
            <Input
              type="date"
              aria-label="Date"
              className="h-10 border-0 bg-transparent pl-9 text-photo shadow-none focus-visible:ring-0 dark:bg-transparent [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>

          <Button type="submit" size="lg" className="md:ml-2">
            Search
          </Button>
        </form>

        {/* Stats */}
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <dt className="font-heading text-xl font-bold text-photo">
                {s.value}
              </dt>
              <dd className="text-xs text-photo-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}