"use client"

import { SlidersHorizontal, X } from "lucide-react"
import * as React from "react"

import { Container } from "@/components/Container/Container"
import { Reveal } from "@/components/Animation/Reveal"

import { StudioCard } from "@/components/Studio card/Studio-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { sortOptions } from "@/lib/Site-data"
import { getPublicStudios } from "@/lib/Studio-api"
import {
  PRICE_MAX,
  applyFilters,
  defaultFilters,
  type Filters,
} from "@/lib/Studio-filters"
import { cn, formatTaka } from "@/lib/utils"
import { SearchBar } from "./Search-bar"
import { FiltersSidebar } from "./Filters-sidebar"

const PAGE_SIZE = 9
const EMPTY_STUDIOS: Awaited<ReturnType<typeof getPublicStudios>> = []

/** Search bar + filter sidebar + studio grid for the Explore Studios page. */
export function ExploreStudios({
  initialCategory = defaultFilters.category,
}: {
  initialCategory?: string
}) {
  const [studioState, setStudioState] = React.useState<
    | { status: "loading" }
    | {
        status: "ready"
        studios: Awaited<ReturnType<typeof getPublicStudios>>
      }
    | { status: "error"; message: string }
  >({ status: "loading" })
  const [retryCount, setRetryCount] = React.useState(0)
  const [filters, setFilters] = React.useState<Filters>({
    ...defaultFilters,
    category: initialCategory,
  })
  const [showFilters, setShowFilters] = React.useState(false)

  const update = React.useCallback(
    (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch })),
    []
  )
  const clear = React.useCallback(() => setFilters(defaultFilters), [])

  React.useEffect(() => {
    const controller = new AbortController()
    getPublicStudios(controller.signal)
      .then((studios) => {
        if (!controller.signal.aborted) {
          setStudioState({ status: "ready", studios })
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setStudioState({
          status: "error",
          message:
            error instanceof Error ? error.message : "Could not load studios.",
        })
      })

    return () => controller.abort()
  }, [retryCount])

  const studios =
    studioState.status === "ready" ? studioState.studios : EMPTY_STUDIOS
  const locations = [...new Set(studios.map((studio) => studio.city))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
  const results = React.useMemo(
    () => applyFilters(filters, studios),
    [filters, studios]
  )

  // "Load more" count resets whenever the filters change (no effect needed)
  const signature = JSON.stringify(filters)
  const [limit, setLimit] = React.useState({ signature, count: PAGE_SIZE })
  const count = limit.signature === signature ? limit.count : PAGE_SIZE
  const visible = results.slice(0, count)

  const resultsRef = React.useRef<HTMLDivElement>(null)
  const scrollToResults = React.useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  // removable chips that show which filters are applied
  const chips: { key: string; label: string; remove: () => void }[] = []
  if (filters.query.trim())
    chips.push({
      key: "q",
      label: `“${filters.query.trim()}”`,
      remove: () => update({ query: "" }),
    })
  if (filters.category !== defaultFilters.category)
    chips.push({
      key: "cat",
      label: filters.category,
      remove: () => update({ category: defaultFilters.category }),
    })
  if (filters.location !== defaultFilters.location)
    chips.push({
      key: "loc",
      label: filters.location,
      remove: () => update({ location: defaultFilters.location }),
    })
  if (filters.priceMin !== 0 || filters.priceMax !== PRICE_MAX)
    chips.push({
      key: "price",
      label: `${formatTaka(filters.priceMin)}–${filters.priceMax >= PRICE_MAX ? `${formatTaka(PRICE_MAX)}+` : formatTaka(filters.priceMax)}`,
      remove: () => update({ priceMin: 0, priceMax: PRICE_MAX }),
    })
  if (filters.rating)
    chips.push({
      key: "rating",
      label: `${filters.rating}+ & above`,
      remove: () => update({ rating: 0 }),
    })
  filters.amenities.forEach((a) =>
    chips.push({
      key: `am-${a}`,
      label: a,
      remove: () =>
        update({ amenities: filters.amenities.filter((x) => x !== a) }),
    })
  )

  return (
    <section className="bg-background pt-10 pb-20">
      <Container>
        <Reveal>
          <SearchBar
            filters={filters}
            locations={locations}
            update={update}
            onSearch={scrollToResults}
          />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
          {/* Sidebar */}
          <div>
            <Button
              type="button"
              variant="outline"
              className="mb-4 w-full lg:hidden"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="size-4" />
              {showFilters ? "Hide filters" : "Show filters"}
            </Button>

            <Reveal
              className={cn(
                "lg:sticky lg:top-28 lg:block",
                showFilters ? "block" : "hidden"
              )}
            >
              {/* own scroller on desktop: the page keeps scrolling, the filters scroll separately */}
              <div className="[scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] lg:-mx-1 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:px-1 lg:pr-3">
                <FiltersSidebar
                  filters={filters}
                  update={update}
                  onClear={clear}
                />
              </div>
            </Reveal>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="scroll-mt-28">
            <div className="flex items-center justify-between gap-4">
              <p
                className="text-xs text-muted-foreground"
                aria-live="polite"
                aria-busy={studioState.status === "loading"}
              >
                {studioState.status === "loading"
                  ? "Loading studios…"
                  : studioState.status === "error"
                    ? "Studios could not be loaded"
                    : `Showing ${visible.length} of ${results.length} studios`}
              </p>

              <Select
                value={filters.sort}
                onValueChange={(v) => v && update({ sort: v })}
              >
                <SelectTrigger
                  aria-label="Sort studios"
                  className="h-9 w-auto min-w-44 rounded-xl text-xs"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  align="end"
                  sideOffset={8}
                  className="rounded-xl border-border bg-popover p-1.5 shadow-2xl"
                >
                  {sortOptions.map((o) => (
                    <SelectItem
                      key={o}
                      value={o}
                      className="rounded-md py-2 text-xs focus:bg-accent focus:text-accent-foreground"
                    >
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.remove}
                    aria-label={`Remove filter ${chip.label}`}
                    className="group flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary"
                  >
                    {chip.label}
                    <X className="size-3 text-muted-foreground transition-colors group-hover:text-primary" />
                  </button>
                ))}
              </div>
            )}

            {studioState.status === "loading" ? (
              <StudioGridSkeleton />
            ) : studioState.status === "error" ? (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
              >
                <p className="text-sm text-foreground">{studioState.message}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setStudioState({ status: "loading" })
                    setRetryCount((count) => count + 1)
                  }}
                >
                  Try again
                </Button>
              </div>
            ) : visible.length > 0 ? (
              <div className="mt-6 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((studio, i) => (
                  <Reveal key={studio.id} delay={(i % 3) * 80}>
                    <StudioCard studio={studio} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
                <p className="font-heading text-base font-bold text-foreground">
                  {studios.length === 0
                    ? "No studios listed yet"
                    : "No studios match your filters"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {studios.length === 0
                    ? "Check back soon for creative spaces in your area."
                    : "Try a different city, a wider price range, or fewer amenities."}
                </p>
                {studios.length > 0 && (
                  <Button
                    variant="outline"
                    className="btn-alive mt-5"
                    onClick={clear}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            )}

            {count < results.length && (
              <div className="mt-12 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="btn-alive rounded-xl"
                  onClick={() =>
                    setLimit({ signature, count: count + PAGE_SIZE })
                  }
                >
                  Load more studios
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

function StudioGridSkeleton() {
  return (
    <div
      aria-busy="true"
      className="mt-6 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
    >
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div key={item} aria-hidden="true" className="space-y-4">
          <Skeleton className="aspect-[4/3] rounded-2xl motion-reduce:animate-none" />
          <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
          <Skeleton className="h-3 w-1/2 motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  )
}
