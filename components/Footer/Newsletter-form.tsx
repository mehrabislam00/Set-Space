"use client"

import { ArrowRight, Check } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterForm() {
  const [sent, setSent] = React.useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: send e.currentTarget.email.value to your newsletter API
    setSent(true)
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xs">
      <Input
        type="email"
        name="email"
        required
        aria-label="Email address"
        placeholder="Your email address"
        disabled={sent}
        className="h-10 rounded-r-none border-r-0 bg-background text-xs"
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Subscribe"
        disabled={sent}
        className="btn-flat size-10 shrink-0 rounded-l-none hover:brightness-110"
      >
        {sent ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
      </Button>
    </form>
  )
}