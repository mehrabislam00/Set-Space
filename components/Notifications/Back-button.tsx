"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Round arrow button that returns to the previous page.
 *  Falls back to `fallbackHref` when there is no history (e.g. opened in a new tab). */
export function BackButton({
  fallbackHref = "/",
  label = "Go back",
  className,
}: {
  fallbackHref?: string
  label?: string
  className?: string
}) {
  const router = useRouter()

  function goBack() {
    if (window.history.length > 1) router.back()
    else router.push(fallbackHref)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      onClick={goBack}
      className={cn("btn-alive group size-9 shrink-0 rounded-full", className)}
    >
      <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none" />
    </Button>
  )
}