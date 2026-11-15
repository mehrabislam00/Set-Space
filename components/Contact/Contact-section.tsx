import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"

import { contactInfo } from "@/lib/Site-data"
import { ContactForm } from "./Contact-form"

/** Contact details on the left, message form on the right. */
export function ContactSection() {
  return (
    <section className="bg-background py-16 md:py-20">
      <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <ul className="space-y-6">
            {contactInfo.map(({ icon: Icon, label, value, href }, i) => (
              <Reveal as="li" key={label} delay={i * 80} className="group">
                <div className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground motion-reduce:transition-none">
                    <Icon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="font-heading text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-primary"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-heading text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={260}>
            <p className="mt-8 text-[11px] text-muted-foreground">
              Sample contact details shown for demo purposes.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="w-full max-w-xl lg:justify-self-end">
          <ContactForm />
        </Reveal>
      </Container>
    </section>
  )
}