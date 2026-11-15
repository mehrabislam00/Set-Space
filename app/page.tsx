import { CategoriesSection } from "@/components/Home/Categories section/Categories-section";
import { FeaturedStudios } from "@/components/Home/Featured studios/Featured-studios";
import { FinalCta } from "@/components/Home/Final cta/Final-cta";
import { HeroBanner } from "@/components/Home/Hero banner/Hero-banner";
import { HostBanner } from "@/components/Home/Host banner/Host-banner";
import { HowItWorks } from "@/components/Home/How it works/How-it-works";
import { Testimonials } from "@/components/Home/Testimonials/Testimonials";
import { WhySetSpace } from "@/components/Home/Why setspace/Why-setspace";



export default function Page() {
  return (
    <main className="relative">
      <HeroBanner />
      <CategoriesSection />
       <FeaturedStudios />
       <WhySetSpace />
       <HowItWorks />
        <HostBanner />
      <Testimonials />
      <FinalCta />
    </main>
  )
}