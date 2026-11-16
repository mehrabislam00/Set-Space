import type { Metadata } from "next"

import { EditStudio } from "@/components/Host/Edit-studio"

export const metadata: Metadata = {
  title: "Edit Studio — SetSpace",
  description: "Update your studio details, photos, availability and rules.",
}

type PageProps = {
  searchParams: Promise<{ id?: string | string[] }>
}

export default async function EditStudioPage({ searchParams }: PageProps) {
  const { id } = await searchParams

  return <EditStudio studioId={typeof id === "string" ? id : undefined} />
}
