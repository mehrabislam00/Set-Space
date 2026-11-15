import { Container } from "@/components/Container/Container"
import { DashboardSidebar } from "@/components/Dashboard/Dashboard-sidebar"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background">
      <Container className="max-w-6xl py-6 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <DashboardSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </Container>
    </div>
  )
}