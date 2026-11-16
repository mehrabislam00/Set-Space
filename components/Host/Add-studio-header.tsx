import React from "react"

type AddStudioHeaderProps = {
  title?: string
  description?: React.ReactNode
}

const AddStudioHeader = ({
  title = "Add a new studio",
  description = (
    <>
      Fields marked <span className="text-primary">*</span> are required to
      publish. Drafts can be saved anytime.
    </>
  ),
}: AddStudioHeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default AddStudioHeader
