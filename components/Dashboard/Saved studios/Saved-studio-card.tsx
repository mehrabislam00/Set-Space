import { MapPin, Star, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import type { Studio } from "@/components/Studio card/Studio-card"
import { cn } from "@/lib/utils"

type SavedStudioCardProps = {
  studio: Studio
  onRemove: () => void
}

/** Studio card for the Saved Studios page: same look as `StudioCard`, with
 *  "View Studio" and "Remove" actions in place of the heart toggle. */
export function SavedStudioCard({ studio, onRemove }: SavedStudioCardProps) {
  const href = `/explore-studio/${studio.id}`

  return (
    <article className="group transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link
        href={href}
        aria-label={studio.name}
        className="relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-300 group-hover:border-primary/40 group-hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Image
          src={studio.image}
          alt={studio.name}
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
      </Link>

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

      <div className="mt-4 flex gap-2">
        <Link
          href={href}
          className={cn(
            buttonVariants(),
            "btn-alive h-9 flex-1 text-xs font-semibold"
          )}
        >
          View Studio
        </Link>
        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
          aria-label={`Remove ${studio.name} from saved studios`}
          className="btn-alive h-9 gap-1.5 px-3 text-xs font-semibold hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
          Remove
        </Button>
      </div>
    </article>
  )
}