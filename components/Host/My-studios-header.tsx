export function MyStudiosHeader({ count }: { count: number }) {
  return (
    <header>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        Manage My Studios
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        {count} {count === 1 ? "listing" : "listings"}
      </p>
    </header>
  )
}