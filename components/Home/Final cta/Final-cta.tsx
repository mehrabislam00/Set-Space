import Link from "next/link"


import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Container } from "@/components/Container/Container"

export function FinalCta() {
  return (
    <section className="bg-background py-24">
      <Container className="text-center">
        <h2 className="mx-auto max-w-xl font-heading text-3xl leading-tight font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
          Your next great project starts on the right set.
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/studios"
            className={cn(
              buttonVariants({ size: "lg" }),
              "btn-alive shadow-[0_0_30px_-6px_var(--primary)]"
            )}
          >
            Find a Studio
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "btn-alive")}
          >
            Create Account
          </Link>
        </div>
      </Container>
    </section>
  )
}