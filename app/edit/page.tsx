import { redirect } from "next/navigation"

type EditAliasPageProps = {
  searchParams: Promise<{
    id?: string | string[]
    edit?: string | string[]
  }>
}

/**
 * Legacy alias for the host studio editor. The real page lives inside the
 * host dashboard so it renders with the host sidebar and navigation.
 */
export default async function EditAliasPage({
  searchParams,
}: EditAliasPageProps) {
  const params = await searchParams
  const rawId = params.id ?? params.edit
  const id = typeof rawId === "string" ? rawId : undefined

  redirect(
    id
      ? `/host/my-studios/edit?id=${encodeURIComponent(id)}`
      : "/host/my-studios"
  )
}
