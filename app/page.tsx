import { HeroBanner } from "@/components/Hero banner/Hero-banner"
import { Navbar } from "@/components/Navbar/navbar"

export default function Page() {
  return (
    <main className="relative min-h-svh">
      <Navbar />
      <HeroBanner />
    </main>
  )
}