import Link from "next/link"

import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Closing call-to-action on the About page. */
export function JoinCta() {
  return (
    <section className="bg-background py-24">
      <Container className="text-center">
        <Reveal>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Join the creative community.
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "btn-alive")}
          >
            Create Account
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "btn-alive"
            )}
          >
            Contact us
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}