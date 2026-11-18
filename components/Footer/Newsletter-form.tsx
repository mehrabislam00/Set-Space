"use client"

import { ArrowRight, Check, Loader2 } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import {
  MarketplaceApiError,
  subscribeToNewsletter,
} from "@/lib/Marketplace-api"

export function NewsletterForm() {
  const [sent, setSent] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const submitGuard = React.useRef(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitGuard.current || sent) return

    const form = e.currentTarget
    const data = new FormData(form)
    submitGuard.current = true
    setSubmitting(true)
    try {
      const result = await subscribeToNewsletter(
        String(data.get("email") ?? "")
      )
      setSent(true)
      toast.add({
        title: result.alreadySubscribed
          ? "Already subscribed"
          : "You're on the list",
        description: result.alreadySubscribed
          ? "This email is already subscribed to SetSpace updates."
          : "Thanks for subscribing to SetSpace updates.",
        type: result.alreadySubscribed ? "info" : "success",
      })
    } catch (error) {
      if (error instanceof MarketplaceApiError) return
      toast.add({
        title: "Subscription not saved",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
        type: "error",
      })
    } finally {
      submitGuard.current = false
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xs" aria-busy={submitting}>
      <Input
        type="email"
        name="email"
        required
        maxLength={254}
        aria-label="Email address"
        placeholder="Your email address"
        disabled={sent || submitting}
        className="h-10 rounded-r-none border-r-0 bg-background text-xs"
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Subscribe"
        disabled={sent || submitting}
        className="btn-flat size-10 shrink-0 rounded-l-none hover:brightness-110"
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : sent ? (
          <Check className="size-4" />
        ) : (
          <ArrowRight className="size-4" />
        )}
      </Button>
    </form>
  )
}
