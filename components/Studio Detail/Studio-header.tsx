"use client"

import { Check, Heart, MapPin, Share2, Star } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { StudioDetail } from "@/lib/Site-data"
import { cn } from "@/lib/utils"

/** Breadcrumb, title, rating/location line, share + save buttons. */
type StudioHeaderData = Pick<
  StudioDetail,
  "name" | "category" | "rating" | "reviews" | "location"
>

export function StudioHeader({ studio }: { studio: StudioHeaderData }) {
  const [saved, setSaved] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  async function onShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: studio.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      // user closed the share sheet — nothing to do
    }
  }

  return (
    <header className="stagger-in">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/explore-studio" className="transition-colors hover:text-primary">
          Explore
        </Link>
        <span>/</span>
        <span>{studio.category}</span>
        <span>/</span>
        <span aria-current="page" className="font-semibold text-foreground">
          {studio.name}
        </span>
      </nav>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge className="border-0 bg-accent text-[10px] font-medium text-accent-foreground">
            {studio.category}
          </Badge>
          <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {studio.name}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-primary text-primary" />
              <span className="font-bold text-foreground">{studio.rating}</span>
              ({studio.reviews} reviews)
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 text-primary" />
              {studio.location}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onShare}
            className="btn-flat rounded-full px-3 text-xs"
          >
            {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
            {copied ? "Link copied" : "Share"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={saved ? "Remove from favorites" : "Save to favorites"}
            aria-pressed={saved}
            onClick={() => setSaved((v) => !v)}
            className="btn-flat rounded-full"
          >
            <Heart
              className={cn("size-4 transition-colors", saved && "fill-primary text-primary")}
            />
          </Button>
        </div>
      </div>
    </header>
  )
}