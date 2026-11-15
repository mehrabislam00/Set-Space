"use client"

import { ArrowRight, CalendarClock, Clapperboard, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { steps } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

// One icon per entry of `steps` (Discover, Book, Create)
const stepIcons = [Sparkles, CalendarClock, Clapperboard]

/** "How It Works" hero button. Opens a quick 3-step card; the CTA inside
 *  links to the full /how-it-works page. */
export function HowItWorksDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button
        type="button"
        size="lg"
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-white/15 bg-black/30 text-photo hover:bg-white/10 hover:text-photo"
      >
        <Play className="size-3.5 fill-current" />
        How It Works
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto rounded-2xl p-6 sm:max-w-3xl sm:p-8">
          <div>
            <DialogTitle className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Three steps to your next shoot
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              Renting a studio on SetSpace is simple and straightforward.
            </DialogDescription>
          </div>

          <ol className="grid gap-3 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = stepIcons[i]
              return (
                <li
                  key={step.title}
                  className="rounded-2xl bg-muted p-5 transition-colors duration-300 hover:bg-accent"
                >
                  <Icon className="size-6 text-primary" strokeWidth={1.5} />
                  <h3 className="mt-5 font-heading text-base font-bold text-foreground">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              )
            })}
          </ol>

          <Link
            href="/how-it-works"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ size: "lg" }), "btn-alive w-full")}
          >
            Read the full guide
            <ArrowRight className="size-4" />
          </Link>
        </DialogContent>
      </Dialog>
    </>
  )
}