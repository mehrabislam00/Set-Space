import { Plus } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HostHeader() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Host Dashboard
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Your studios at a glance
        </p>
      </div>

      <Link
        href="/host/my-studios/add-studio"
        className={cn(
          buttonVariants({ size: "lg" }),
          "btn-alive h-9 px-4 text-xs font-semibold"
        )}
      >
        <Plus className="size-3.5" />
        Add Studio
      </Link>
    </header>
  )
}