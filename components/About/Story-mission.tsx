import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"
import { aboutIntro } from "@/lib/Site-data"

/** "Our story" + "Our mission" two-column intro on the About page. */
export function StoryMission() {
  return (
    <section className="bg-background pt-20 pb-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {aboutIntro.map((item, i) => (
            <Reveal key={item.eyebrow} delay={i * 100} className="group">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                {item.eyebrow}
              </p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-3xl">
                {item.title}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}