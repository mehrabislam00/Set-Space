import { Container } from "@/components/Container/Container"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingStudioDetail() {
  return (
    <main className="relative bg-background pt-28 pb-20" aria-busy="true">
      <Container>
        <Skeleton className="h-3 w-56 motion-reduce:animate-none" />

        <div className="mt-5 space-y-3">
          <Skeleton className="h-5 w-28 motion-reduce:animate-none" />
          <Skeleton className="h-10 w-72 max-w-full motion-reduce:animate-none" />
          <Skeleton className="h-4 w-64 max-w-full motion-reduce:animate-none" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:h-[384px] md:grid-cols-4 md:grid-rows-2">
          <Skeleton className="col-span-2 aspect-[16/10] rounded-2xl motion-reduce:animate-none md:row-span-2 md:aspect-auto" />
          {[0, 1, 2, 3].map((image) => (
            <Skeleton
              key={image}
              className="aspect-[4/3] rounded-2xl motion-reduce:animate-none md:aspect-auto"
            />
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-10">
            {[0, 1, 2].map((section) => (
              <div key={section} className="space-y-4">
                <Skeleton className="h-7 w-48 motion-reduce:animate-none" />
                <Skeleton className="h-4 w-full motion-reduce:animate-none" />
                <Skeleton className="h-4 w-4/5 motion-reduce:animate-none" />
              </div>
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl motion-reduce:animate-none" />
        </div>
      </Container>
    </main>
  )
}
