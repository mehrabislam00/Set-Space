import type { Metadata } from "next"

import studioFilm from "@/assets/studio-film.jpg"

import { PageBanner } from "@/components/PageBanner/Page-banner"
import { categoryKeyMap } from "@/lib/Site-data"
import { ExploreStudios } from "@/components/Explore studios/Explore-studios"

export const metadata: Metadata = {
  title: "Explore Studios — SetSpace",
  description: "Discover the perfect space for your next project.",
}

export default async function ExploreStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  // lets links like /explore-studio?category=photo open with that filter on
  const { category } = await searchParams
  const initialCategory = categoryKeyMap[category ?? ""] ?? "All Categories"

  return (
    <main className="relative">
      <PageBanner
        title="Explore Creative Studios"
        description="Discover the perfect space for your next project."
        image={studioFilm}
        imageAlt="Film crew on a lit sound stage with a camera on a dolly"
      />

      <ExploreStudios key={initialCategory} initialCategory={initialCategory} />
    </main>
  )
}