import type { Metadata } from "next"

import { Reveal } from "@/components/Animation/Reveal"
import { Container } from "@/components/Container/Container"
import { NotificationsList } from "@/components/Notifications/Notifications-ist"


export const metadata: Metadata = {
  title: "Notifications — SetSpace",
  description: "Booking updates, requests and reviews from your SetSpace account.",
}

export default function NotificationsPage() {
  return (
    <main className="relative bg-background pt-28 pb-20">
      <Container className="max-w-3xl">
        <Reveal>
          <NotificationsList />
        </Reveal>
      </Container>
    </main>
  )
}