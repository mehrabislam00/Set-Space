import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { SavedStudios } from "@/components/Dashboard/Saved studios/Saved-studios"


export const metadata: Metadata = {
  title: "Saved Studios — SetSpace",
  description: "The studios you've saved on SetSpace, ready to book.",
}

export default function SavedStudiosPage() {
  return (
    <Reveal>
      <SavedStudios />
    </Reveal>
  )
}