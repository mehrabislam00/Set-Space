import type { Metadata } from "next"

import studioArt from "@/assets/studio-art.jpg"
import { DifferenceSection } from "@/components/About/Difference-section"

import { StatsSection } from "@/components/About/Stats-section"
import { StoryMission } from "@/components/About/Story-mission"
import { StudioGallery } from "@/components/About/Studio-gallery"
import { PageBanner } from "@/components/PageBanner/Page-banner"
import { JoinCta } from "@/components/About/Join-cta"

export const metadata: Metadata = {
  title: "About — SetSpace",
  description: "Built by creators who were tired of hunting for space.",
}

export default function AboutPage() {
  return (
    <main className="relative">
      <PageBanner
        eyebrow="About SetSpace"
        title="Built by creators who were tired of hunting for space."
        image={studioArt}
        imageAlt="Painter's art studio with easels, canvases and brushes"
      />

      <StoryMission />

      <StudioGallery />

      <DifferenceSection />

      <StatsSection />

      <JoinCta />
    </main>
  )
}