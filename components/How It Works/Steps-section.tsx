import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/Container/Container"
import { howItWorksSteps } from "@/lib/Site-data"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/Animation/Reveal"

/** Four alternating image/text steps shown on the How It Works page. */
export function StepsSection() {
  return (
    <section className="bg-background py-20">
      <Container>
        <Reveal>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
            For creators
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Four steps to your set
          </h2>
        </Reveal>

        <ol className="mt-14 flex flex-col gap-14">
          {howItWorksSteps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 80}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              {/* alternate image left / image right; hover matches StudioCard */}
              <div
                className={`group overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  width={640}
                  height={400}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
              </div>

              <div
                className={`group/text transition-colors duration-300 ${
                  i % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                <span className="font-heading text-4xl font-extrabold text-muted-foreground/40 transition-colors duration-300 group-hover/text:text-primary sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-xl font-bold text-foreground transition-colors duration-300 group-hover/text:text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={180} className="mt-14 w-fit">
          <Link
            href="/explore-studio"
            className={cn(buttonVariants({ size: "lg" }), "btn-alive rounded-full")}
          >
            Start exploring
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}
