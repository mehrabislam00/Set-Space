"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"
import { faqs } from "@/lib/Site-data"

/** Searchable FAQ list for the full FAQ page. */
export function FaqSearch() {
  const [query, setQuery] = React.useState("")

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return faqs
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <section className="bg-background py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions..."
                aria-label="Search questions"
                className="h-11 rounded-xl bg-card pl-10 text-sm"
              />
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-6">
            {results.length > 0 ? (
              <Accordion>
                {results.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="py-0.5">
                    <AccordionTrigger className="rounded-xl px-3 py-4 text-sm font-semibold transition-colors duration-300 hover:bg-muted/60 hover:text-primary hover:no-underline aria-expanded:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-4 text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                No questions match “{query}”. Try a different word or{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact our team
                </Link>
                .
              </p>
            )}
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-8 text-xs text-muted-foreground">
              Still need help?{" "}
              <Link
                href="/contact"
                className="font-medium text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"
              >
                Contact our team.
              </Link>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}