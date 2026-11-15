"use client"

import { Heart, MapPin, Star } from "lucide-react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Studio = {
  id: number
  name: string
  category: string
  location: string
  price: number
  rating: number
  reviews: number
  image: StaticImageData
}

export function StudioCard({ studio }: { studio: Studio }) {
  const [saved, setSaved] = React.useState(false)

  return (
    <article className="group transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-300 group-hover:border-primary/40 group-hover:shadow-card-hover">
        <Link
          href={`/studios/${studio.id}`}
          aria-label={studio.name}
          className="absolute inset-0 z-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Image
            src={studio.image}
            alt={studio.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <Badge className="pointer-events-none absolute top-3 left-3 z-10 border-0 bg-black/55 text-[10px] font-medium text-photo backdrop-blur-sm">
          {studio.category}
        </Badge>

        <Button
          type="button"
          size="icon"
          aria-label={saved ? "Remove from favorites" : "Save to favorites"}
          aria-pressed={saved}
          onClick={() => setSaved((v) => !v)}
          className="btn-flat absolute top-3 right-3 z-10 size-8 rounded-full border-0 bg-black/55 text-photo backdrop-blur-sm hover:scale-110 hover:bg-black/75"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              saved && "fill-primary text-primary"
            )}
          />
        </Button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-heading text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
            {studio.name}
          </h3>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 text-primary" />
            {studio.location}
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-primary text-primary" />
            <span className="font-medium text-foreground">{studio.rating}</span>
            ({studio.reviews})
          </p>
        </div>

        <p className="shrink-0 text-right">
          <span className="font-heading text-base font-bold text-foreground">
            ${studio.price}
          </span>
          <span className="ml-0.5 text-[10px] text-muted-foreground">/hr</span>
        </p>
      </div>
    </article>
  )
}