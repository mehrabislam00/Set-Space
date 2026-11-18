import React, { useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"

import studioArt from "@/assets/studio-art.jpg"
import studioContent from "@/assets/studio-content.jpg"
import studioFilm from "@/assets/studio-film.jpg"
import studioLoft from "@/assets/studio-loft.jpg"
import studioMusic from "@/assets/studio-music.jpg"
import studioPhoto from "@/assets/studio-photo.jpg"
import studioPodcast from "@/assets/studio-podcast.jpg"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  IMAGE_UPLOAD_ACCEPT,
  ImageUploadValidationError,
  MAX_IMAGE_UPLOAD_BYTES,
  validateImageFile,
} from "@/lib/Image-upload"

const MAX_PHOTOS = 8

const SAMPLE_PHOTOS = [
  studioPhoto.src,
  studioMusic.src,
  studioPodcast.src,
  studioFilm.src,
  studioContent.src,
  studioArt.src,
  studioLoft.src,
]

interface AddStudioPhotosProps {
  photos: string[]
  onChange: (photos: string[]) => void
  onBusyChange?: (busy: boolean) => void
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Could not read this photo."))
      }
    }
    reader.onerror = () => reject(new Error("Could not read this photo."))
    reader.readAsDataURL(file)
  })
}

const AddStudioPhotos = ({
  photos,
  onChange,
  onBusyChange,
}: AddStudioPhotosProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isReading, setIsReading] = useState(false)

  const addFiles = async (files: FileList | File[]) => {
    if (isReading) return

    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) {
      toast.add({
        title: `You can add up to ${MAX_PHOTOS} studio photos.`,
        type: "error",
      })
      return
    }

    const selected = Array.from(files)
    setIsReading(true)
    onBusyChange?.(true)
    try {
      const validatedFiles = await Promise.all(
        selected.slice(0, remaining).map(validateImageFile)
      )
      const urls = await Promise.all(validatedFiles.map(readAsDataUrl))
      onChange([...photos, ...urls])
      if (selected.length > remaining) {
        toast.add({
          title: `Only ${MAX_PHOTOS} studio photos can be added.`,
          type: "info",
        })
      }
    } catch (readError) {
      const message =
        readError instanceof ImageUploadValidationError
          ? readError.message
          : "Could not read the selected images. Please try again."
      toast.add({ title: message, type: "error" })
    } finally {
      setIsReading(false)
      onBusyChange?.(false)
    }
  }

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, photoIndex) => photoIndex !== index))
  }

  const addSamplePhotos = () => {
    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) {
      toast.add({
        title: `You can add up to ${MAX_PHOTOS} studio photos.`,
        type: "error",
      })
      return
    }
    onChange([...photos, ...SAMPLE_PHOTOS.slice(0, remaining)])
  }

  return (
    <div className="space-y-4" aria-busy={isReading}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ")
            fileInputRef.current?.click()
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <ImagePlus className="h-8 w-8 text-primary" />
        <p className="text-sm font-medium">Drag photos here or</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isReading}
            onClick={(event) => {
              event.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            {isReading ? <Loader2 className="size-4 animate-spin" /> : null}
            {isReading ? "Reading photos…" : "Upload photos"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isReading}
            onClick={(event) => {
              event.stopPropagation()
              addSamplePhotos()
            }}
          >
            Use sample photos
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Up to {MAX_PHOTOS} photos. JPG/JPEG, PNG, WebP, GIF, or SVG;{" "}
          {MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024)} MB per image. The first photo
          is your cover.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_UPLOAD_ACCEPT}
        multiple
        hidden
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files)
          event.target.value = ""
        }}
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo, index) => (
            <div
              key={`${photo}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={`Studio photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {index === 0 && (
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                  Cover
                </Badge>
              )}
              <button
                type="button"
                onClick={() => removePhoto(index)}
                disabled={isReading}
                className="absolute top-2 right-2 rounded-full bg-background/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddStudioPhotos
