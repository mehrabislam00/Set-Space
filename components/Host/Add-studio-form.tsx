"use client"

"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AvailabilityFields } from '@/components/Host/Availability-fields'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AddStudioPhotos from '@/components/Host/Add-studio-photos'
import AddStudioSection from '@/components/Host/Add-studio-section'

const CATEGORIES = [
  'Photo Studios',
  'Music Studios',
  'Podcast Studios',
  'Film Studios',
  'Content Creation Studios',
  'Art Studios',
]

const AMENITIES = [
  'Professional Lighting',
  'Air Conditioning',
  'Wi-Fi',
  'Soundproofing',
  'Parking',
  'Changing Room',
  'Makeup Station',
  'Photography Equipment',
  'Kitchen Access',
]

const CANCELLATION_POLICIES = ['Flexible', 'Moderate', 'Strict']

interface StudioFormData {
  name: string
  category: string
  shortDescription: string
  fullDescription: string
  country: string
  city: string
  area: string
  streetAddress: string
  hourlyRate: string
  minimumHours: string
  cleaningFee: string
  maxGuests: string
  studioSize: string
  amenities: string[]
  photos: string[]
  availableDays: string[]
  opens: string
  closes: string
  unavailableDate: string
  cancellationPolicy: string
  studioRules: string
  additionalInstructions: string
}

const INITIAL_FORM_DATA: StudioFormData = {
  name: '',
  category: 'Photo Studios',
  shortDescription: '',
  fullDescription: '',
  country: 'USA',
  city: '',
  area: '',
  streetAddress: '',
  hourlyRate: '',
  minimumHours: '2',
  cleaningFee: '',
  maxGuests: '',
  studioSize: '',
  amenities: [],
  photos: [],
  availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  opens: '08:00',
  closes: '22:00',
  unavailableDate: '',
  cancellationPolicy: 'Flexible',
  studioRules: '',
  additionalInstructions: '',
}

const AddStudioForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<StudioFormData>(INITIAL_FORM_DATA)

  const updateField = <K extends keyof StudioFormData>(key: K, value: StudioFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayItem = (key: 'amenities' | 'availableDays', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // TODO: wire up to the API once the studio endpoints are available
    console.log('Publishing studio:', formData)
    router.push('/host/my-studios')
  }

  const handleSaveDraft = () => {
    // TODO: wire up to the API once the studio endpoints are available
    console.log('Saving draft:', formData)
    router.push('/host/my-studios')
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-10'>
      <AddStudioSection step={1} title='Basic information'>
        <div className='space-y-2'>
          <Label htmlFor='studio-name'>Studio name *</Label>
          <Input
            id='studio-name'
            placeholder='e.g. Moonlight Loft'
            value={formData.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => {
              if (value !== null) updateField('category', value)
            }}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='short-description'>Short description *</Label>
          <Input
            id='short-description'
            value={formData.shortDescription}
            onChange={(event) => updateField('shortDescription', event.target.value)}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='full-description'>Full description</Label>
          <Textarea
            id='full-description'
            rows={5}
            value={formData.fullDescription}
            onChange={(event) => updateField('fullDescription', event.target.value)}
          />
        </div>
      </AddStudioSection>

      <AddStudioSection
        step={2}
        title='Location'
        hint='The exact address is only shared with confirmed renters.'
      >
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='country'>Country</Label>
            <Input
              id='country'
              value={formData.country}
              onChange={(event) => updateField('country', event.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='city'>City *</Label>
            <Input
              id='city'
              value={formData.city}
              onChange={(event) => updateField('city', event.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='area'>Area / Neighborhood</Label>
            <Input
              id='area'
              value={formData.area}
              onChange={(event) => updateField('area', event.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='street-address'>Street address</Label>
            <Input
              id='street-address'
              value={formData.streetAddress}
              onChange={(event) => updateField('streetAddress', event.target.value)}
            />
          </div>
        </div>
      </AddStudioSection>

      <AddStudioSection step={3} title='Pricing'>
        <div className='grid gap-4 sm:grid-cols-3'>
          <div className='space-y-2'>
            <Label htmlFor='hourly-rate'>Hourly rate ($) *</Label>
            <Input
              id='hourly-rate'
              type='number'
              min='0'
              value={formData.hourlyRate}
              onChange={(event) => updateField('hourlyRate', event.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='minimum-hours'>Minimum hours</Label>
            <Input
              id='minimum-hours'
              type='number'
              min='1'
              value={formData.minimumHours}
              onChange={(event) => updateField('minimumHours', event.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='cleaning-fee'>Cleaning fee ($)</Label>
            <Input
              id='cleaning-fee'
              type='number'
              min='0'
              value={formData.cleaningFee}
              onChange={(event) => updateField('cleaningFee', event.target.value)}
            />
          </div>
        </div>
      </AddStudioSection>

      <AddStudioSection step={4} title='Capacity'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='max-guests'>Maximum guests *</Label>
            <Input
              id='max-guests'
              type='number'
              min='1'
              value={formData.maxGuests}
              onChange={(event) => updateField('maxGuests', event.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='studio-size'>Studio size (sq ft)</Label>
            <Input
              id='studio-size'
              type='number'
              min='0'
              value={formData.studioSize}
              onChange={(event) => updateField('studioSize', event.target.value)}
            />
          </div>
        </div>
      </AddStudioSection>

      <AddStudioSection step={5} title='Amenities'>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className='flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary/50'
            >
              <Checkbox
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={() => toggleArrayItem('amenities', amenity)}
              />
              <span className='text-sm'>{amenity}</span>
            </label>
          ))}
        </div>
      </AddStudioSection>

      <AddStudioSection step={6} title='Photos'>
        <AddStudioPhotos photos={formData.photos} onChange={(photos) => updateField('photos', photos)} />
      </AddStudioSection>

      <AddStudioSection step={7} title='Availability'>
        <AvailabilityFields
          availableDays={formData.availableDays}
          opens={formData.opens}
          closes={formData.closes}
          unavailableDate={formData.unavailableDate}
          onToggleDay={(day) => toggleArrayItem('availableDays', day)}
          onOpensChange={(value) => updateField('opens', value)}
          onClosesChange={(value) => updateField('closes', value)}
          onUnavailableDateChange={(value) =>
            updateField('unavailableDate', value)
          }
        />
      </AddStudioSection>

      <AddStudioSection step={8} title='Rules'>
        <div className='space-y-2'>
          <Label>Cancellation policy</Label>
          <Select
            value={formData.cancellationPolicy}
            onValueChange={(value) => updateField('cancellationPolicy', value ?? '')}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a policy' />
            </SelectTrigger>
            <SelectContent>
              {CANCELLATION_POLICIES.map((policy) => (
                <SelectItem key={policy} value={policy}>
                  {policy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='studio-rules'>Studio rules (one per line)</Label>
          <Textarea
            id='studio-rules'
            rows={5}
            value={formData.studioRules}
            onChange={(event) => updateField('studioRules', event.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='additional-instructions'>Additional instructions</Label>
          <Textarea
            id='additional-instructions'
            rows={3}
            value={formData.additionalInstructions}
            onChange={(event) => updateField('additionalInstructions', event.target.value)}
          />
        </div>
      </AddStudioSection>

      <div className='flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6'>
        <Button type='button' variant='ghost' onClick={() => router.push('/host/my-studios')}>
          Cancel
        </Button>
        <Button type='button' variant='outline' onClick={handleSaveDraft}>
          Save as Draft
        </Button>
        <Button type='submit'>Publish Studio</Button>
      </div>
    </form>
  )
}

export default AddStudioForm