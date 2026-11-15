import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"
import { faqs } from "@/lib/Site-data"

/** FAQ accordion shown on the How It Works page. */
export function FaqSection() {
  return (
    <section className="bg-background py-20">
      <Container>
        <Reveal className="text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-10 max-w-3xl">
          <Accordion defaultValue={[faqs[0].id]}>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="py-1">
              <AccordionTrigger className="rounded-xl px-4 py-4 text-base font-semibold transition-colors duration-300 hover:bg-muted/60 hover:text-primary hover:no-underline aria-expanded:bg-muted/60 aria-expanded:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
          </Accordion>
        </Reveal>

        <Reveal delay={220}>
          <Link
            href="/faq"
            className="btn-alive group mx-auto mt-8 flex w-fit items-center gap-1.5 text-sm font-medium text-primary"
          >
            See all FAQs
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}
