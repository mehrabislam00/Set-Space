import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import studioMusic from "@/assets/studio-music.jpg"
import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/Container/Container"
import { hostSteps } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

/** "For hosts" numbered steps + image, shown on the How It Works page. */
export function HostSteps() {
  return (
    <section className="border-y border-border bg-card py-20">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
              For hosts
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Turn empty hours into income
            </h2>

            <ol className="mt-10 flex flex-col gap-6">
              {hostSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="group flex items-start gap-4 rounded-xl p-1.5 -m-1.5 transition-colors duration-300 hover:bg-muted/60"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/host"
              className={cn(buttonVariants({ size: "lg" }), "btn-alive mt-10")}
            >
              List Your Studio
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* hover matches StudioCard */}
          <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <Image
              src={studioMusic}
              alt="Recording studio with a mixing console and monitors"
              width={720}
              height={900}
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
