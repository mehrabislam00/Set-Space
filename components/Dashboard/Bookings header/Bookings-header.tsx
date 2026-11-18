import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BookingsHeader({
  total,
  loading,
}: {
  total: number
  loading: boolean
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          My Bookings
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {loading
            ? "Loading your bookings…"
            : `${total} ${total === 1 ? "booking" : "bookings"} in total`}
        </p>
      </div>

      <Link
        href="/explore-studio"
        className={cn(
          buttonVariants({ size: "lg" }),
          "btn-alive h-9 px-4 text-xs font-semibold"
        )}
      >
        Book a Studio
      </Link>
    </header>
  )
}
