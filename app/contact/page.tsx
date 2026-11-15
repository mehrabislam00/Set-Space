import type { Metadata } from "next"

import studioLoft from "@/assets/studio-loft.jpg"
import { ContactSection } from "@/components/Contact/Contact-section"
import { PageBanner } from "@/components/PageBanner/Page-banner"

export const metadata: Metadata = {
  title: "Contact — SetSpace",
  description:
    "Questions about a booking, hosting or partnerships? Send us a note.",
}

export default function ContactPage() {
  return (
    <main className="relative">
      <PageBanner
        eyebrow="Contact"
        title="We're here to help."
        description="Questions about a booking, hosting or partnerships? Send us a note."
        image={studioLoft}
        imageAlt="Brick loft studio with a leather armchair"
      />

      <ContactSection />
    </main>
  )
}