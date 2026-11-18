"use client"

import { LoaderCircle, Phone, Star } from "lucide-react"
import * as React from "react"
import Link from "next/link"

import { Reveal } from "@/components/Animation/Reveal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  getStudioContactPhone,
  MarketplaceApiError,
} from "@/lib/Marketplace-api"
import type { StudioDetail } from "@/lib/Site-data"

function isMobileDevice() {
  return (
    /Android|iPhone|iPad|iPod|IEMobile|Windows Phone/i.test(
      navigator.userAgent
    ) ||
    (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  )
}

function normalizePhoneNumber(value: string | null) {
  if (!value) return null

  const phone = value.trim().replace(/[\s().-]/g, "")
  if (!/^\+?\d+$/.test(phone)) return null

  const digits = phone.startsWith("+") ? phone.slice(1) : phone
  if (/^01[3-9]\d{8}$/.test(digits)) return `+880${digits.slice(1)}`
  if (/^0[2-9]\d{7,9}$/.test(digits)) return `+880${digits.slice(1)}`
  if (/^8801[3-9]\d{8}$/.test(digits)) return `+${digits}`
  if (/^880\d{8,10}$/.test(digits)) return `+${digits}`
  if (phone.startsWith("+") && /^[1-9]\d{6,14}$/.test(digits)) {
    return `+${digits}`
  }
  return null
}

async function copyPhoneNumber(phone: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(phone)
      return
    } catch {
      // Fall back to the selection-based copy for browsers without permission.
    }
  }

  const input = document.createElement("textarea")
  input.value = phone
  input.setAttribute("readonly", "")
  input.style.position = "fixed"
  input.style.opacity = "0"
  document.body.append(input)
  input.select()
  const copied = document.execCommand("copy")
  input.remove()
  if (!copied) throw new Error("Could not copy the host's phone number.")
}

/** "Hosted by" card with a Contact Host button.
 *  Mobile: avatar + name on top, bio below, full-width button.
 *  sm and up: avatar | name + bio | button in one row. */
export function StudioHost({
  host,
  studioId,
}: {
  host: StudioDetail["host"]
  studioId: string | null
}) {
  const [isContacting, setIsContacting] = React.useState(false)
  const [contactError, setContactError] = React.useState<string | null>(null)
  const [signInRequired, setSignInRequired] = React.useState(false)
  const [contactNumber, setContactNumber] = React.useState<string | null>(null)

  async function onContactHost() {
    if (isContacting) return
    setContactError(null)
    setSignInRequired(false)
    setContactNumber(null)
    if (!studioId) {
      setContactError("Direct phone contact is unavailable for this listing.")
      return
    }

    setIsContacting(true)
    try {
      const phone = normalizePhoneNumber(await getStudioContactPhone(studioId))
      if (!phone) {
        setContactError("The host has not added a valid phone number.")
        return
      }

      if (isMobileDevice()) {
        window.location.href = `tel:${phone}`
        return
      }

      setContactNumber(phone)
      await copyPhoneNumber(phone)
      setContactNumber(null)
      toast.add({
        title: "Phone number copied!",
        description: "The host’s phone number is ready to paste.",
        type: "success",
      })
    } catch (error) {
      if (error instanceof MarketplaceApiError && error.status === 401) {
        setContactError("Sign in to contact this host.")
        setSignInRequired(true)
      } else {
        setContactError(
          error instanceof Error
            ? error.message
            : "Could not load the host’s phone number."
        )
      }
    } finally {
      setIsContacting(false)
    }
  }

  return (
    <section id="host" className="scroll-mt-40">
      <Reveal className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr_auto] sm:gap-x-5 sm:gap-y-0">
        <Avatar className="size-12 bg-secondary sm:row-span-2 sm:size-14">
          <AvatarFallback className="bg-transparent text-xs font-semibold text-muted-foreground">
            {host.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 sm:self-end">
          <p className="text-[10px] text-muted-foreground">Hosted by</p>
          <p className="font-heading text-base font-bold text-foreground">
            {host.name}
          </p>
          <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:gap-1.5">
            {host.rating !== null && (
              <span className="flex items-center gap-1">
                <Star className="size-3 fill-primary text-primary" />
                {host.rating} host rating
              </span>
            )}
            {host.rating !== null && host.since !== null && (
              <span aria-hidden className="hidden sm:inline">
                ·
              </span>
            )}
            {host.since !== null && <span>Member since {host.since}</span>}
          </div>
        </div>

        <p className="col-span-2 text-xs leading-relaxed text-muted-foreground sm:col-span-1 sm:col-start-2 sm:mt-2 sm:max-w-md sm:self-start">
          {host.bio}
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onContactHost}
          disabled={isContacting}
          aria-busy={isContacting}
          className="btn-alive col-span-2 w-full text-xs sm:col-span-1 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:w-auto sm:self-center"
        >
          {isContacting ? (
            <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Phone className="size-3.5" aria-hidden />
          )}
          {isContacting ? "Loading number…" : "Contact Host"}
        </Button>
        {contactError ? (
          <p
            role="alert"
            className="col-span-2 text-xs text-destructive sm:col-span-3"
          >
            {contactError}
            {signInRequired && (
              <>
                {" "}
                <Link
                  href="/login"
                  className="font-semibold underline underline-offset-2"
                >
                  Sign in
                </Link>
              </>
            )}
            {contactNumber ? ` ${contactNumber}` : ""}
          </p>
        ) : null}
      </Reveal>
    </section>
  )
}
