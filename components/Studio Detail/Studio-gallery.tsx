"use client"

import { ChevronLeft, ChevronRight, LayoutGrid, X } from "lucide-react"
import Image from "next/image"
import * as React from "react"

import { Reveal } from "@/components/Animation/Reveal"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { StudioDetail } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

type StudioGalleryProps = {
  name: string
  images: StudioDetail["images"]
}

/** 1 large + 4 small mosaic. Any tile (or the button) opens a lightbox with
 *  prev/next arrows, a thumbnail strip, a counter and ← → keyboard support. */
export function StudioGallery({ name, images }: StudioGalleryProps) {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  const count = images.length
  const prev = React.useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count]
  )
  const next = React.useCallback(
    () => setIndex((i) => (i + 1) % count),
    [count]
  )

  function show(i: number) {
    setIndex(i)
    setOpen(true)
  }

  React.useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, prev, next])

  const active = images[index]

  return (
    <Reveal className="mt-8">
      <div className="grid grid-cols-2 gap-3 md:h-[384px] md:grid-cols-4 md:grid-rows-2">
        {images.slice(0, 5).map((img, i) => (
          <button
            key={img.alt}
            type="button"
            onClick={() => show(i)}
            aria-label={`Open photo: ${img.alt}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              i === 0
                ? "col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto"
                : "aspect-[4/3] md:aspect-auto"
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes={
                i === 0
                  ? "(min-width: 768px) 50vw, 100vw"
                  : "(min-width: 768px) 25vw, 50vw"
              }
              className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
          </button>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => show(0)}
          className="btn-flat rounded-full px-3 text-xs"
        >
          <LayoutGrid className="size-3.5" />
          View all {count} photos
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="gap-3 bg-background p-3 sm:max-w-5xl"
        >
          <DialogTitle className="sr-only">{name} — photos</DialogTitle>

          {/* Main photo */}
          <div className="relative aspect-[3/2] max-h-[70svh] w-full overflow-hidden rounded-xl bg-card">
            <Image
              key={active.alt}
              src={active.src}
              alt={active.alt}
              fill
              sizes="(min-width: 1024px) 1000px, 100vw"
              className="object-cover"
            />

            <Button
              type="button"
              size="icon"
              aria-label="Close gallery"
              onClick={() => setOpen(false)}
              className="btn-flat absolute top-3 right-3 size-8 rounded-full border-0 bg-black/55 text-photo backdrop-blur-sm hover:bg-black/75"
            >
              <X className="size-4" />
            </Button>

            <Button
              type="button"
              size="icon"
              aria-label="Previous photo"
              onClick={prev}
              className="btn-flat absolute top-1/2 left-3 size-9 -translate-y-1/2 rounded-full border-0 bg-black/55 text-photo backdrop-blur-sm hover:bg-black/75"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              type="button"
              size="icon"
              aria-label="Next photo"
              onClick={next}
              className="btn-flat absolute top-1/2 right-3 size-9 -translate-y-1/2 rounded-full border-0 bg-black/55 text-photo backdrop-blur-sm hover:bg-black/75"
            >
              <ChevronRight className="size-5" />
            </Button>

            <span
              aria-live="polite"
              className="absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-photo backdrop-blur-sm"
            >
              {index + 1} / {count}
            </span>
          </div>

          {/* Thumbnails */}
          <ul className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((img, i) => (
              <li key={img.alt} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "relative block h-16 w-24 overflow-hidden rounded-lg border-2 transition-[border-color,opacity] duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:h-[72px] sm:w-28",
                    i === index
                      ? "border-photo"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </Reveal>
  )
}