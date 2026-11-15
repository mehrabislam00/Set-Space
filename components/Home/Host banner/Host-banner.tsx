import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import studioMusic from "@/assets/studio-music.jpg"
import { Container } from "@/components/container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HostBanner() {
  return (
    <section className="bg-background py-12">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl border border-border">
          <Image
            src={studioMusic}
            alt="Recording studio with a mixing console and monitors"
            fill
            sizes="100vw"
            className="-z-20 object-cover"
          />
          {/* keeps the text readable in both themes */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />

          <div className="max-w-lg px-6 py-12 sm:px-10 sm:py-14">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
              Become a host
            </p>
            <h2 className="font-heading text-3xl leading-tight font-extrabold tracking-tight text-photo sm:text-4xl">
              Your studio deserves a full calendar.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-photo-muted">
              List your space in minutes, set your own rates and hours, and
              approve every booking yourself.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/host" className={buttonVariants({ size: "lg" })}>
                List Your Studio
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/how-it-works"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/15 bg-black/40 text-photo hover:bg-white/10 hover:text-photo"
                )}
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}