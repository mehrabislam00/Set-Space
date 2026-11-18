import { PageTransition } from "@/components/Animation/Page-transition"
import { Container } from "@/components/Container/Container"
import { HostOnboardingGate } from "@/components/Host/Host-onboarding-gate"
import { HostSidebar } from "@/components/Host/Host-sidebar"

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HostOnboardingGate>
      <div className="min-h-svh bg-background">
        {/* pt clears the fixed navbar (h-20) so it never covers the sidebar or page title */}
        <Container className="max-w-6xl pt-24 pb-6 sm:pt-28 sm:pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <HostSidebar />
            {/* only this area re-animates when the page changes; the sidebar stays mounted */}
            <main className="min-w-0 flex-1">
              <PageTransition scope="content">{children}</PageTransition>
            </main>
          </div>
        </Container>
      </div>
    </HostOnboardingGate>
  )
}
