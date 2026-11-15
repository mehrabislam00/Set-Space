import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Container } from "@/components/Container/Container"

import { getStudioDetail } from "@/lib/Site-data"
import { StudioHeader } from "@/components/Studio Detail/Studio-header"
import { StudioGallery } from "@/components/Studio Detail/Studio-gallery"
import { StudioTabs } from "@/components/Studio Detail/Studio-tabs"
import { StudioAmenities } from "@/components/Studio Detail/Studio-amenities"
import { StudioOverview } from "@/components/Studio Detail/Studio-overview"
import { StudioHost } from "@/components/Studio Detail/Studio-host"
import { StudioReviews } from "@/components/Studio Detail/Studio-reviews"
import { StudioLocation } from "@/components/Studio Detail/Studio-location"
import { BookingCard } from "@/components/Studio Detail/Booking-card"
import { SimilarStudios } from "@/components/Studio Detail/Similar-studios"

type PageProps = {
  params: Promise<{ "studio-detail": string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const studio = getStudioDetail((await params)["studio-detail"])
  if (!studio) return { title: "Studio not found — SetSpace" }

  return {
    title: `${studio.name} — SetSpace`,
    description: studio.description,
  }
}

export default async function StudioDetailPage({ params }: PageProps) {
  const studio = getStudioDetail((await params)["studio-detail"])
  if (!studio) notFound()

  return (
    <main className="relative bg-background pt-28 pb-20">
      <Container>
        <StudioHeader
          studio={{
            name: studio.name,
            category: studio.category,
            rating: studio.rating,
            reviews: studio.reviews,
            location: studio.location,
          }}
        />
        <StudioGallery name={studio.name} images={studio.images} />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="min-w-0">
            <StudioTabs />

            <div className="space-y-14 pt-10">
              <StudioOverview studio={studio} />
              <StudioAmenities amenities={studio.amenities} />
              <StudioHost host={studio.host} />
              <StudioReviews
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
              price={studio.price}
              rating={studio.rating}
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