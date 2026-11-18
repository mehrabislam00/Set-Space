import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Container } from "@/components/Container/Container"
import { getPublicStudioDetail } from "@/lib/Studio-api"
import { StudioHeader } from "@/components/Studio Detail/Studio-header"
import { StudioGallery } from "@/components/Studio Detail/Studio-gallery"
import { StudioTabs } from "@/components/Studio Detail/Studio-tabs"
import { StudioAmenities } from "@/components/Studio Detail/Studio-amenities"
import { StudioOverview } from "@/components/Studio Detail/Studio-overview"
import { StudioHost } from "@/components/Studio Detail/Studio-host"
import { StudioReviews } from "@/components/Studio Detail/Studio-reviews"
import { StudioLocation } from "@/components/Studio Detail/Studio-location"
import { StudioOpeningHours } from "@/components/Studio Opening Hours/Studio-opening-hours"
import { BookingCard } from "@/components/Studio Detail/Booking-card"
import { SimilarStudios } from "@/components/Studio Detail/Similar-studios"
import { MarketplaceApiError } from "@/lib/Marketplace-api"
import { getStudioDetail as getLegacyStudioDetail } from "@/lib/Site-data"

type PageProps = {
  params: Promise<{ "studio-detail": string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const id = (await params)["studio-detail"]
  const legacyStudio = /^\d+$/.test(id) ? getLegacyStudioDetail(id) : undefined
  if (legacyStudio) {
    return {
      title: `${legacyStudio.name} — SetSpace`,
      description: legacyStudio.description,
    }
  }

  try {
    const studio = await getPublicStudioDetail(id)
    return {
      title: `${studio.name} — SetSpace`,
      description: studio.description,
    }
  } catch {
    return { title: "Studio — SetSpace" }
  }
}

export default async function StudioDetailPage({ params }: PageProps) {
  const id = (await params)["studio-detail"]
  const legacyStudio = /^\d+$/.test(id) ? getLegacyStudioDetail(id) : undefined
  let studio = legacyStudio

  if (!studio) {
    try {
      studio = await getPublicStudioDetail(id)
    } catch (error) {
      if (error instanceof MarketplaceApiError && error.status === 404) {
        notFound()
      }

      return (
        <main className="relative bg-background pt-28 pb-20">
          <Container>
            <div
              role="alert"
              className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
            >
              <h1 className="font-heading text-xl font-bold text-foreground">
                Studio unavailable
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "We could not load this studio. Please try again."}
              </p>
            </div>
          </Container>
        </main>
      )
    }
  }

  return (
    <main className="relative bg-background pt-28 pb-20">
      <Container>
        <StudioHeader
          studio={{
            id: studio.id,
            name: studio.name,
            category: studio.category,
            rating: studio.rating,
            reviews: studio.reviews,
            createdAt: studio.createdAt,
            location: studio.location,
          }}
        />
        <StudioGallery name={studio.name} images={studio.images} />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="min-w-0">
            <StudioTabs />

            <div className="space-y-14 pt-10">
              <StudioOverview studio={studio} />
              <StudioOpeningHours hours={studio.openingHours} />
              <StudioAmenities amenities={studio.amenities} />
              <StudioHost
                host={studio.host}
                studioId={typeof studio.id === "string" ? studio.id : null}
              />
              <StudioReviews
                key={studio.id}
                studioId={typeof studio.id === "string" ? studio.id : null}
                studio={{
                  rating: studio.rating,
                  reviews: studio.reviews,
                  ratingBreakdown: studio.ratingBreakdown,
                  reviewList: studio.reviewList,
                }}
              />
              <StudioLocation location={studio.location} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <BookingCard
              studioId={typeof studio.id === "string" ? studio.id : null}
              price={studio.price}
              rating={studio.rating}
              reviews={studio.reviews}
              capacity={studio.capacity}
              minHours={studio.minHours}
              serviceFeeRate={studio.serviceFeeRate}
            />
          </aside>
        </div>

        <SimilarStudios currentId={studio.id} category={studio.category} />
      </Container>
    </main>
  )
}
