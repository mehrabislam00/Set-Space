import { Quote, Star } from "lucide-react"

import { Container } from "@/components/Container/Container"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { testimonials } from "@/lib/Site-data"
import { Reveal } from "@/components/Animation/Reveal"

export function Testimonials() {
  return (
    <section className="bg-background py-16">
      <Container>
        <Reveal>
          <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
            Loved by creators
          </p>
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-primary" />
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              What our community says
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="group gap-0 rounded-2xl py-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <CardContent className="flex h-full flex-col p-6">
                <Quote
                  className="size-5 text-primary transition-transform duration-300 group-hover:scale-125"
                  strokeWidth={1.5}
                />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  {t.quote}
                </blockquote>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 bg-secondary">
                      <AvatarFallback className="bg-transparent text-[10px] font-semibold text-primary">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}