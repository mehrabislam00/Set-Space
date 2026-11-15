import type { Metadata } from "next"

import studioContent from "@/assets/studio-content.jpg"
import { PageBanner } from "@/components/How It Works/Page-banner"


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

      {/* add the next sections of this page here */}

    </main>
  )
}