import { Skeleton } from "@/components/ui/skeleton"

export function MyStudiosHeader({
  count,
  loading = false,
}: {
  count: number
  loading?: boolean
}) {
  return (
    <header>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        Manage My Studios
      </h1>
      {loading ? (
        <Skeleton className="mt-2 h-3 w-16 motion-reduce:animate-none" />
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">
          {count} {count === 1 ? "listing" : "listings"}
        </p>
      )}
    </header>
  )
}
