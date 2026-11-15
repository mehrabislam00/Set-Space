import { redirect } from "next/navigation"

type PageProps = {
  params: Promise<{ "studio-detail": string }>
}

export default async function StudioRedirect({ params }: PageProps) {
  const { "studio-detail": studioDetail } = await params
  redirect(`/explore-studio/${studioDetail}`)
}
