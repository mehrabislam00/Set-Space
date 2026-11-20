"use client"

import { Camera } from "lucide-react"
import * as React from "react"

import { useAccountProfile } from "@/components/Dashboard/Account-profile-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import {
  IMAGE_UPLOAD_ACCEPT,
  ImageUploadValidationError,
  MAX_IMAGE_UPLOAD_BYTES,
  validateImageFile,
} from "@/lib/Image-upload"
import { getProfileImageUrl, type ProfileResponse } from "@/lib/Marketplace-api"

/** Large avatar with a change-photo button, plus the account stats beneath it. */
export function ProfileAvatar({ account }: { account: ProfileResponse }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { pendingPhoto, setPendingPhoto, user } = useAccountProfile()
  const [validating, setValidating] = React.useState(false)
  const [loadedPhoto, setLoadedPhoto] = React.useState<string | null>(null)
  const [failedPhoto, setFailedPhoto] = React.useState<string | null>(null)
  const stats = [
    { label: "Bookings", value: account.stats.bookings },
    { label: "Listings", value: account.stats.listings },
    { label: "Member since", value: account.stats.memberSince },
  ]
  const initials =
    account.profile.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "SS"

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setValidating(true)
    try {
      const validatedFile = await validateImageFile(file)
      setPendingPhoto({
        file: validatedFile,
        previewUrl: URL.createObjectURL(validatedFile),
      })
    } catch (validationError) {
      const message =
        validationError instanceof ImageUploadValidationError
          ? validationError.message
          : "Could not read this image. Please try another file."
      toast.add({ title: message, type: "error" })
    } finally {
      setValidating(false)
    }
  }

  const profileImage = user?.image ?? getProfileImageUrl(account.profile.image)
  const photo = pendingPhoto?.previewUrl || profileImage
  const photoPending = !!photo && loadedPhoto !== photo && failedPhoto !== photo

  return (
    <div
      className="flex items-center gap-6 md:flex-col md:items-start md:gap-0"
      aria-busy={validating}
    >
      <div className="relative shrink-0">
        <Avatar className="size-24 border border-primary/40 bg-secondary sm:size-28">
          {photo && (
            <AvatarImage
              src={photo}
              alt="Your profile photo"
              onLoad={() => setLoadedPhoto(photo)}
              onError={() => setFailedPhoto(photo)}
            />
          )}
          <AvatarFallback className="bg-transparent font-heading text-2xl font-bold text-primary">
            {photoPending ? (
              <Skeleton className="size-full rounded-full motion-reduce:animate-none" />
            ) : (
              initials
            )}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          aria-label="Change profile photo"
          disabled={validating}
          onClick={() => inputRef.current?.click()}
          className="btn-flat absolute right-0 bottom-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >
          <Camera className="size-3.5" />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_UPLOAD_ACCEPT}
          onChange={onPick}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
        />
      </div>

      <div className="min-w-0 flex-1 md:mt-5 md:w-full">
        <dl className="grid grid-cols-3 gap-4 md:grid-cols-1 md:gap-3.5">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-[11px] text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 font-heading text-sm font-bold text-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] text-muted-foreground">
          JPG/JPEG, PNG, WebP, GIF, or SVG · up to{" "}
          {MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024)} MB
        </p>
      </div>
    </div>
  )
}
