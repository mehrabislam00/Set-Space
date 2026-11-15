import Image, { type StaticImageData } from "next/image"
import { Container } from "../Container/Container"


type PageBannerProps = {
  eyebrow: string
  title: string
  description?: string
  image: StaticImageData
  imageAlt: string
}

/** Reusable inner-page banner (How It Works, Explore Studios, About ...). */
export function PageBanner({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: PageBannerProps) {
  return (
    <section className="relative isolate flex min-h-[460px] items-center overflow-hidden bg-background md:min-h-[520px]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* darkening layers keep the text readable in both themes */}
      <div className="absolute inset-0 -z-10 bg-black/60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-black/40" />

      <Container className="pt-28 pb-20">
        <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-heading text-4xl leading-[1.08] font-extrabold tracking-tight text-photo sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-photo-muted">
            {description}
          </p>
        )}
      </Container>
    </section>
  )
}