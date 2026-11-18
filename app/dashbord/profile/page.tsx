import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { ProfileHeader } from "@/components/Dashboard/Profile/Profile-header"
import { ProfileContent } from "@/components/Dashboard/Profile/Profile-content"

export const metadata: Metadata = {
  title: "My Profile — SetSpace",
  description: "Edit how hosts and renters see you on SetSpace.",
}

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <Reveal>
        <ProfileHeader />
      </Reveal>

      <Reveal delay={80}>
        <ProfileContent />
      </Reveal>
    </div>
  )
}
