
import { Container } from "@/components/Container/Container"
import { steps } from "@/lib/Site-data"

export function HowItWorks() {
  return (
    // bg-card gives this band a different shade from the sections around it
    <section className="border-y border-border bg-card py-20">
      <Container>
        <div className="text-center">
          <p className="mb-4 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
            How it works
          </p>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            From idea to set in minutes
          </h2>
        </div>

        <ol className="relative mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-3">
          {/* connecting line, runs from the 1st to the 3rd circle */}
          <div
            aria-hidden
            className="absolute top-3.5 right-[16.66%] left-[16.66%] hidden h-px bg-border md:block"
          />

          {steps.map((step, i) => (
            <li key={step.title} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-5 font-heading text-base font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-60 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
