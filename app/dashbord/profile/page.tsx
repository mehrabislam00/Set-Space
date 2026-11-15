import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { ProfileHeader } from "@/components/Dashboard/Profile/Profile-header"
import { ProfileAvatar } from "@/components/Dashboard/Profile/Profile-avatar"
import { ProfileForm } from "@/components/Dashboard/Profile/Profile-form"


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
        <div className="grid gap-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10">
          <ProfileAvatar />
          <ProfileForm />
        </div>
      </Reveal>
    </div>
  )
}