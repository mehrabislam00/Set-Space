"use client"

import * as React from "react"
import Link from "next/link"

import { ThemeProvider } from "@/components/theme-provider"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <title>Something went wrong — SetSpace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <main className="flex min-h-screen items-center justify-center px-5 py-16">
            <section className="w-full max-w-xl rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/10 text-2xl text-destructive">
                !
              </span>
              <h1 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                SetSpace needs a moment.
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                An unexpected error stopped the app from loading. Try again, or
                return to the homepage.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={retry}
                  className="btn-alive inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Try again
                </button>
                <Link
                  href="/"
                  className="btn-alive inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Go to homepage
                </Link>
              </div>
            </section>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
