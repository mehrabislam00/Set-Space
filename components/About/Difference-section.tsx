import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"
import { aboutDifferences } from "@/lib/Site-data"

/** "What makes us different" — three points with a top rule. */
export function DifferenceSection() {
  return (
    <section className="bg-background pt-8 pb-20">
      <Container>
        <Reveal>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
            What makes us different
          </p>
        </Reveal>

        <div className="mt-6 grid gap-8 md:grid-cols-3 md:gap-8">
          {aboutDifferences.map((item, i) => (
            <Reveal key={item.title} delay={i * 80} className="group">
              <div className="border-t border-foreground/30 pt-5 transition-colors duration-300 group-hover:border-primary">
                <h3 className="font-heading text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}