"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Container } from "@/components/Container/Container"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RouteErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function Error({ error, retry }: RouteErrorProps) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[65vh] items-center py-16 sm:py-24">
      <Container className="w-full">
        <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" strokeWidth={1.5} />
          </span>
          <h1 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            We hit an unexpected issue.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Your page could not be loaded. You can try again or return to
            SetSpace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              size="lg"
              className="btn-alive"
              onClick={retry}
            >
              Try again
            </Button>
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
