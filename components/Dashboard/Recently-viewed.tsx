import { StudioCard } from "@/components/Studio card/Studio-card"
import { recentlyViewedIds } from "@/lib/Dashboard-data"
import { exploreStudios } from "@/lib/Site-data"

export function RecentlyViewed() {
  const studios = recentlyViewedIds
    .map((id) => exploreStudios.find((studio) => studio.id === id))
    .filter((studio) => studio !== undefined)

  return (
    <section aria-labelledby="recent-heading">
      <h2
        id="recent-heading"
        className="font-heading text-lg font-extrabold tracking-tight text-foreground"
      >
        Recently viewed
      </h2>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </div>
    </section>
  )
}