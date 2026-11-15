import Image from "next/image"

import studioFilm from "@/assets/studio-film.jpg"
import studioMusic from "@/assets/studio-music.jpg"
import studioPhoto from "@/assets/studio-photo.jpg"
import studioPodcast from "@/assets/studio-podcast.jpg"
import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"

// Mosaic: tall photo on the left, two small tiles on top, one wide tile below.
const tiles = [
  {
    src: studioPhoto,
    alt: "White cyclorama photo studio with a concrete floor",
    span: "row-span-2",
    sizes: "(min-width: 768px) 33vw, 50vw",
  },
  {
    src: studioPodcast,
    alt: "Podcast room with a wooden table and two microphones",
    span: "",
    sizes: "(min-width: 768px) 33vw, 50vw",
  },
  {
    src: studioMusic,
    alt: "Music studio with a mixing console and monitors",
    span: "",
    sizes: "(min-width: 768px) 33vw, 50vw",
  },
  {
    src: studioFilm,
    alt: "Film crew on a lit sound stage with a camera on a dolly",
    span: "col-span-2",
    sizes: "(min-width: 768px) 66vw, 100vw",
  },
]

/** Image mosaic on the About page. Hover matches StudioCard. */
export function StudioGallery() {
  return (
    <section className="bg-background pb-12">
      <Container>
        <div className="grid grid-cols-2 grid-rows-[150px_150px_240px] gap-3 md:h-[560px] md:grid-cols-3 md:grid-rows-[1fr_2fr] md:gap-4">
          {tiles.map((tile, i) => (
            <Reveal key={tile.alt} delay={i * 80} className={tile.span}>
              {/* hover lives on this inner wrapper so it doesn't fight Reveal's transition */}
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  sizes={tile.sizes}
                  className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}