"use client"

import { useRouter } from "next/navigation"

import { StudioForm } from "@/components/Host/Studio-form"
import { DEFAULT_STUDIO_FORM_DATA, type StudioFormData } from "@/lib/Host-data"

const AddStudioForm = () => {
  const router = useRouter()

  function handlePublish(data: StudioFormData) {
    // TODO: wire up to the API once the studio endpoints are available
    console.log("Publishing studio:", data)
    router.push("/host/my-studios")
  }

  function handleSaveDraft(data: StudioFormData) {
    // TODO: wire up to the API once the studio endpoints are available
    console.log("Saving draft:", data)
    router.push("/host/my-studios")
  }

  return (
    <StudioForm
      initialData={DEFAULT_STUDIO_FORM_DATA}
      submitLabel="Publish Studio"
      onSubmit={handlePublish}
      onSaveDraft={handleSaveDraft}
      onCancel={() => router.push("/host/my-studios")}
    />
  )
}

export default AddStudioForm
