import type { Metadata } from "next"

import studioPodcast from "@/assets/studio-podcast.jpg"
import { FaqSearch } from "@/components/Frequenty Asked Questions/Faq-search"
import { PageBanner } from "@/components/PageBanner/Page-banner"

export const metadata: Metadata = {
  title: "FAQ — SetSpace",
  description: "Answers to common questions about booking and hosting on SetSpace.",
}

export default function FaqPage() {
  return (
    <main className="relative">
      <PageBanner
        eyebrow="Help center"
        title="Frequently asked questions"
        image={studioPodcast}
        imageAlt="Podcast room with broadcast microphones and acoustic panels"
      />

      <FaqSearch />
    </main>
  )
}