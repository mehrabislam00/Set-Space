import type { Metadata } from "next"

import studioContent from "@/assets/studio-content.jpg"
import { PageBanner } from "@/components/PageBanner/Page-banner"
import { StepsSection } from "@/components/How It Works/Steps-section"
import { HostSteps } from "@/components/How It Works/Host-steps"
import { FaqSection } from "@/components/How It Works/Faq-section"


export const metadata: Metadata = {
  title: "How It Works — SetSpace",
  description:
    "Whether you're booking your first shoot or listing your space, here's how SetSpace works.",
}

export default function HowItWorksPage() {
  return (
    <main className="relative">
      

      <PageBanner
        eyebrow="How it works"
        title="Renting a studio is simple and straightforward."
        description="Whether you're booking your first shoot or listing your space, here's how SetSpace works."
        image={studioContent}
        imageAlt="Cozy content studio with a sofa, ring light and camera"
      />

      <StepsSection />

      <HostSteps />

      <FaqSection />

    </main>
  )
}