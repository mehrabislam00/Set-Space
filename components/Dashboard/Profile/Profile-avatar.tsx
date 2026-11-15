"use client"

import { Camera } from "lucide-react"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { dashboardProfile, dashboardUser } from "@/lib/Dashboard-data"

const MAX_PHOTO_MB = 5

const stats = [
  { label: "Bookings", value: dashboardProfile.bookings },
  { label: "Listings", value: dashboardProfile.listings },
  { label: "Member since", value: dashboardProfile.memberSince },
]

/** Large avatar with a change-photo button, plus the account stats beneath it. */
export function ProfileAvatar() {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = React.useState<string | null>(null)
  const [error, setError] = React.useState("")

  // Free the preview URL when it changes or the page unmounts
  React.useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo)
    }
  }, [photo])

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.")
      return
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setError(`Photo must be under ${MAX_PHOTO_MB} MB.`)
      return
    }

    // TODO: upload `file` to your storage and save the returned URL
    setError("")
    setPhoto(URL.createObjectURL(file))
  }

  return (
    <div className="flex items-center gap-6 md:flex-col md:items-start md:gap-0">
      <div className="relative shrink-0">
        <Avatar className="size-24 border border-primary/40 bg-secondary sm:size-28">
          {photo && <AvatarImage src={photo} alt="Your profile photo" />}
          <AvatarFallback className="bg-transparent font-heading text-2xl font-bold text-primary">
            {dashboardUser.initials}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          aria-label="Change profile photo"
          onClick={() => inputRef.current?.click()}
          className="btn-flat absolute right-0 bottom-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground outline-none transition-transform duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >
          <Camera className="size-3.5" />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
        {error && (
          <p role="alert" className="mt-3 text-[11px] text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}