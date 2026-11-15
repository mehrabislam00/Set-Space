"use client"

import { Check } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { contactTopics } from "@/lib/Site-data"

/** Contact form card. Replace the TODO in onSubmit with your API call. */
export function ContactForm() {
  const [topic, setTopic] = React.useState(contactTopics[0])
  const [sent, setSent] = React.useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    // TODO: send { name, email, topic, message } to your backend
    console.log({ ...Object.fromEntries(data), topic })
    setSent(true)
  }

  return (
    <Card className="gap-0 rounded-2xl py-0">
      <CardContent className="p-6">
        {sent ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-6" />
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Message sent
            </h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              Thanks for reaching out. We usually reply within one business day.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setSent(false)}
            >
              Send another
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs text-muted-foreground">
                  Name
                </Label>
                <Input id="name" name="name" required autoComplete="name" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Topic</Label>
              <Select value={topic} onValueChange={(v) => v && setTopic(v)}>
                <SelectTrigger aria-label="Topic" className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  sideOffset={8}
                  className="rounded-xl border-border bg-popover p-1.5"
                >
                  {contactTopics.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className="rounded-md py-2 text-sm focus:bg-accent focus:text-accent-foreground"
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-xs text-muted-foreground">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                className="min-h-28 resize-y"
              />
            </div>

            <Button type="submit" size="lg" className="btn-alive">
              Send message
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}