import React, { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import studioArt from '@/assets/studio-art.jpg'
import studioContent from '@/assets/studio-content.jpg'
import studioFilm from '@/assets/studio-film.jpg'
import studioLoft from '@/assets/studio-loft.jpg'
import studioMusic from '@/assets/studio-music.jpg'
import studioPhoto from '@/assets/studio-photo.jpg'
import studioPodcast from '@/assets/studio-podcast.jpg'

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
}

const AddStudioPhotos = ({ photos, onChange }: AddStudioPhotosProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = (files: FileList | File[]) => {
    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) return
    const urls = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remaining)
      .map((file) => URL.createObjectURL(file))
    if (urls.length > 0) onChange([...photos, ...urls])
  }

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, photoIndex) => photoIndex !== index))
  }

  const addSamplePhotos = () => {
    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) return
    onChange([...photos, ...SAMPLE_PHOTOS.slice(0, remaining)])
  }

  return (
    <div className='space-y-4'>
      <div
        role='button'
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click()
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
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        <ImagePlus className='h-8 w-8 text-primary' />
        <p className='text-sm font-medium'>Drag photos here or</p>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          <Button
            type='button'
            variant='secondary'
            size='sm'
            onClick={(event) => {
              event.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            Upload photos
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={(event) => {
              event.stopPropagation()
              addSamplePhotos()
            }}
          >
            Use sample photos
          </Button>
        </div>
        <p className='text-xs text-muted-foreground'>
          Up to {MAX_PHOTOS} photos. The first photo is your cover.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        hidden
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {photos.length > 0 && (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {photos.map((photo, index) => (
            <div
              key={`${photo}-${index}`}
              className='group relative aspect-square overflow-hidden rounded-lg border border-border'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={`Studio photo ${index + 1}`} className='h-full w-full object-cover' />
              {index === 0 && (
                <Badge className='absolute left-2 top-2 bg-primary text-primary-foreground'>
                  Cover
                </Badge>
              )}
              <button
                type='button'
                onClick={() => removePhoto(index)}
                className='absolute right-2 top-2 rounded-full bg-background/80 p-1.5 opacity-0 transition-opacity hover:bg-background group-hover:opacity-100'
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddStudioPhotos