import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { NotificationsList } from "@/components/Notifications/Notifications-ist"


export const metadata: Metadata = {
  title: "Notifications — SetSpace",
  description: "Booking updates, requests and reviews from your SetSpace account.",
}

export default function NotificationsPage() {
  return (
    <Reveal>
      <NotificationsList />
    </Reveal>
  )
}