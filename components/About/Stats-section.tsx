import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"
import { aboutStats } from "@/lib/Site-data"

/** Number strip on the About page (bg-card band, like the Home "How it works"). */
export function StatsSection() {
  return (
    <section className="border-y border-border bg-card py-12">
      <Container>
        <dl className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 text-center md:grid-cols-4">
          {aboutStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} className="group">
              <div className="transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                <dt className="font-heading text-3xl font-extrabold tracking-tight text-primary transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-1.5 text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {stat.label}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}