"use client"

import { Check, Loader2 } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAccountProfile } from "@/components/Dashboard/Account-profile-provider"
import {
  MarketplaceApiError,
  updateMyProfile,
  uploadMyProfileImage,
  type ProfileResponse,
} from "@/lib/Marketplace-api"
import { PROFILE_BIO_MAX } from "@/lib/Dashboard-data"
import { toast } from "@/components/ui/toast"

type Values = {
  name: string
  phone: string
  location: string
  bio: string
}

type Errors = Partial<Record<keyof Values, string>>

function valuesFromProfile(profile: ProfileResponse["profile"]): Values {
  return {
    name: profile.name,
    phone: profile.phone,
    location: profile.location,
    bio: profile.bio,
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-[11px] text-destructive">
      {message}
    </p>
  )
}

export function ProfileForm({ account }: { account: ProfileResponse }) {
  const { pendingPhoto, setPendingPhoto, clearPendingPhoto, updateProfile } =
    useAccountProfile()
  const initial = valuesFromProfile(account.profile)
  const [saved, setSaved] = React.useState<Values>(initial)
  const [values, setValues] = React.useState<Values>(initial)
  const [errors, setErrors] = React.useState<Errors>({})
  const [loading, setLoading] = React.useState(false)
  const [justSaved, setJustSaved] = React.useState(false)

  const fieldsDirty = (Object.keys(saved) as (keyof Values)[]).some(
    (key) => values[key] !== saved[key]
  )
  const dirty = fieldsDirty || pendingPhoto !== null

  function update(key: keyof Values, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
    setJustSaved(false)
  }

  function onCancel() {
    setValues(saved)
    setErrors({})
    setPendingPhoto(null)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const next: Errors = {}
    if (!values.name.trim()) next.name = "Enter your full name."
    if (values.phone.trim() && !/^[+\d\s()-]{7,20}$/.test(values.phone.trim()))
      next.phone = "Enter a valid phone number."
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    const clean = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      location: values.location.trim(),
      bio: values.bio.trim(),
    }

    try {
      if (fieldsDirty) {
        const result = await updateMyProfile(clean)
        updateProfile(result.profile)
        setValues(clean)
        setSaved(clean)
      }

      if (pendingPhoto) {
        const photoToUpload = pendingPhoto
        const result = await uploadMyProfileImage(photoToUpload.file)
        updateProfile(result.profile, photoToUpload.file)
        clearPendingPhoto(photoToUpload)
      }

      setJustSaved(true)
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={loading}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs text-muted-foreground">
            Full name
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            maxLength={80}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="h-10"
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={account.profile.email || account.user.email}
            readOnly
            disabled
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs text-muted-foreground">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="h-10"
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-xs text-muted-foreground">
            Location
          </Label>
          <Input
            id="location"
            name="location"
            autoComplete="address-level2"
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-xs text-muted-foreground">
          Bio
        </Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={PROFILE_BIO_MAX}
          value={values.bio}
          onChange={(e) => update("bio", e.target.value)}
          className="min-h-28 resize-y"
        />
        <p className="text-right text-[11px] text-muted-foreground">
          {values.bio.length}/{PROFILE_BIO_MAX}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={!dirty || loading}
          className="btn-alive"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={!dirty || loading}
          onClick={onCancel}
        >
          Cancel
        </Button>

        {justSaved && !dirty && (
          <p
            role="status"
            className="flex items-center gap-1.5 text-xs text-success"
          >
            <Check className="size-3.5" />
            Profile updated
          </p>
        )}
      </div>
    </form>
  )
}
