import { CategoriesSection } from "@/components/Categories section/Categories-section";
import { HeroBanner } from "@/components/Hero banner/Hero-banner";


export default function Page() {
  return (
    <main className="relative">
      <HeroBanner />
      <CategoriesSection />
    </main>
  )
}