import type { Metadata } from "next"
import Link from "next/link"
import { SearchX } from "lucide-react"

import { Container } from "@/components/Container/Container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Page Not Found — SetSpace",
  description: "The page you’re looking for isn’t available on SetSpace.",
}

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] items-center py-16 sm:py-24">
      <Container className="w-full">
        <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
            <SearchX className="size-7" strokeWidth={1.5} />
          </span>
          <p className="mt-6 text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
            404 · Page not found
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            This set isn&apos;t on the call sheet.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            The page may have moved, or the link may be out of date. Explore
            available studios or head back to SetSpace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/explore-studio"
              className={cn(buttonVariants({ size: "lg" }), "btn-alive")}
            >
              Explore studios
            </Link>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "btn-alive"
              )}
            >
              Go to homepage
            </Link>
          </div>
        </section>
      </Container>
    </main>
  )
}
