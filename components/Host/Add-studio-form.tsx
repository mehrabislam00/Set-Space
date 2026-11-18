"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { StudioForm } from "@/components/Host/Studio-form"
import { toast } from "@/components/ui/toast"
import { DEFAULT_STUDIO_FORM_DATA, type StudioFormData } from "@/lib/Host-data"
import { MarketplaceApiError } from "@/lib/Marketplace-api"
import { createHostStudio } from "@/lib/Studio-store"

const AddStudioForm = () => {
  const router = useRouter()
  const [pendingAction, setPendingAction] = React.useState<
    "save" | "draft" | null
  >(null)

  async function save(data: StudioFormData, status: "Published" | "Draft") {
    if (pendingAction) return

    setPendingAction(status === "Published" ? "save" : "draft")
    try {
      await createHostStudio(data, status)
      toast.add({
        title: status === "Published" ? "Studio published" : "Draft saved",
        type: "success",
      })
      router.push("/host/my-studios")
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } finally {
      setPendingAction(null)
    }
  }

  function handlePublish(data: StudioFormData) {
    return save(data, "Published")
  }

  function handleSaveDraft(data: StudioFormData) {
    return save(data, "Draft")
  }

  return (
    <StudioForm
      initialData={DEFAULT_STUDIO_FORM_DATA}
      submitLabel="Publish Studio"
      pendingAction={pendingAction}
      onSubmit={handlePublish}
      onSaveDraft={handleSaveDraft}
      onCancel={() => router.push("/host/my-studios")}
    />
  )
}

export default AddStudioForm
