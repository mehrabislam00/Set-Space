import { Building2, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import type { HostStudio, HostStudioStatus } from "@/lib/Host-data"
import { cn, formatTaka } from "@/lib/utils"

export const studioStatusClass: Record<HostStudioStatus, string> = {
  Published: "bg-success/15 text-success",
  Draft: "bg-muted text-muted-foreground",
}

const itemClass = "gap-3 rounded-lg px-2.5 py-2 text-xs font-medium"

type StudioRowProps = {
  studio: HostStudio
  onToggle: (studio: HostStudio, published: boolean) => void | Promise<void>
  onDelete: (studio: HostStudio) => void
  pending?: boolean
}

/** One listing in My Studios: photo, details, publish switch and actions menu. */
export function StudioRow({
  studio,
  onToggle,
  onDelete,
  pending = false,
}: StudioRowProps) {
  const published = studio.status === "Published"

  return (
    <li className="group flex items-center justify-between gap-4 py-4 sm:py-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative h-16 w-22 shrink-0 overflow-hidden rounded-xl">
          {studio.image ? (
            <Image
              src={studio.image}
              alt={studio.name}
              fill
              unoptimized={
                typeof studio.image === "string" &&
                !studio.image.startsWith("/_next/static/")
              }
              sizes="88px"
              className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <span className="flex size-full items-center justify-center bg-muted text-muted-foreground">
              <Building2 className="size-6" strokeWidth={1.25} />
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-sm font-bold text-foreground sm:text-base">
              {studio.name}
            </h3>
            <Badge
              className={cn(
                "h-5 border-0 text-[10px] font-medium",
                studioStatusClass[studio.status]
              )}
            >
              {studio.status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {studio.category} · {studio.city} ·{" "}
            <span className="font-bold text-foreground">
              {formatTaka(studio.price)}/hr
            </span>
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span
          id={`${studio.id}-label`}
          className="hidden text-[11px] text-muted-foreground sm:inline"
        >
          Published
        </span>
        <Switch
          checked={published}
          onCheckedChange={(value) => onToggle(studio, value)}
          aria-labelledby={`${studio.id}-label`}
          aria-label={`${published ? "Unpublish" : "Publish"} ${studio.name}`}
          disabled={pending}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Actions for ${studio.name}`}
                className="btn-flat size-8 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-44 rounded-xl border border-border p-1.5 shadow-2xl"
          >
            <DropdownMenuItem
              render={<Link href={`/explore-studio/${studio.id}`} />}
              disabled={!published}
              className={itemClass}
            >
              <Eye className="size-4" strokeWidth={1.5} />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={`/host/my-studios/edit?id=${studio.id}`} />}
              className={itemClass}
            >
              <Pencil className="size-4" strokeWidth={1.5} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(studio)}
              className={itemClass}
            >
              <Trash2 className="size-4" strokeWidth={1.5} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  )
}
