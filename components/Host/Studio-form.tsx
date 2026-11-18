"use client"

import * as React from "react"
import { CircleCheck } from "lucide-react"

import AddStudioPhotos from "@/components/Host/Add-studio-photos"
import AddStudioSection from "@/components/Host/Add-studio-section"
import { AvailabilityFields } from "@/components/Host/Availability-fields"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  cloneStudioFormData,
  STUDIO_AMENITIES,
  STUDIO_CANCELLATION_POLICIES,
  STUDIO_CATEGORIES,
  type StudioFormData,
} from "@/lib/Host-data"
import {
  STUDIO_WEEKDAYS,
  validateWeeklyOpeningHours,
  type DailyOpeningHours,
  type StudioWeekday,
} from "@/lib/Opening-hours"

type PendingAction = "save" | "draft" | null

type StudioFormProps = {
  initialData: StudioFormData
  submitLabel: string
  pendingAction?: PendingAction
  successMessage?: string | null
  onSubmit: (data: StudioFormData) => void | Promise<void>
  onSaveDraft: (data: StudioFormData) => void | Promise<void>
  onCancel: () => void
}

/**
 * Shared Add / Edit Studio form. The parent owns submission, loading and
 * feedback state; this component only owns the editable field values.
 */
export function StudioForm({
  initialData,
  submitLabel,
  pendingAction = null,
  successMessage,
  onSubmit,
  onSaveDraft,
  onCancel,
}: StudioFormProps) {
  const [formData, setFormData] = React.useState<StudioFormData>(() =>
    cloneStudioFormData(initialData)
  )
  const [photosBusy, setPhotosBusy] = React.useState(false)
  const [scheduleError, setScheduleError] = React.useState<string | null>(null)

  const isPending = pendingAction !== null
  const isBusy = isPending || photosBusy

  const updateField = <K extends keyof StudioFormData>(
    key: K,
    value: StudioFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayItem = (key: "amenities", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }))
  }

  function updateOpeningHours(day: StudioWeekday, hours: DailyOpeningHours) {
    setScheduleError(null)
    setFormData((prev) => {
      const openingHours = { ...prev.openingHours, [day]: hours }
      const availableDays = STUDIO_WEEKDAYS.filter(
        ({ key }) => !openingHours[key].closed
      ).map(({ key }) => key)
      const firstOpenDay = STUDIO_WEEKDAYS.find(
        ({ key }) => !openingHours[key].closed
      )
      const legacyHours = firstOpenDay ? openingHours[firstOpenDay.key] : null

      return {
        ...prev,
        openingHours,
        availableDays,
        opens: legacyHours?.opens ?? prev.opens,
        closes: legacyHours?.closes ?? prev.closes,
      }
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isBusy) return
    const error = validateWeeklyOpeningHours(formData.openingHours, true)
    setScheduleError(error)
    if (error) return
    void onSubmit(formData)
  }

  function handleSaveDraft() {
    if (isBusy) return
    const error = validateWeeklyOpeningHours(formData.openingHours)
    setScheduleError(error)
    if (error) return
    void onSaveDraft(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10" aria-busy={isBusy}>
      {successMessage ? (
        <Alert className="border-success/30 bg-success/10 text-success">
          <CircleCheck aria-hidden />
          <AlertTitle>{successMessage}</AlertTitle>
          <AlertDescription className="text-success/80">
            Taking you back to My Studios…
          </AlertDescription>
        </Alert>
      ) : null}

      <AddStudioSection step={1} title="Basic information">
        <div className="space-y-2">
          <Label htmlFor="studio-name">Studio name *</Label>
          <Input
            id="studio-name"
            placeholder="e.g. Moonlight Loft"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => {
              if (value !== null) updateField("category", value)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {STUDIO_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="short-description">Short description *</Label>
          <Input
            id="short-description"
            value={formData.shortDescription}
            onChange={(event) =>
              updateField("shortDescription", event.target.value)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="full-description">Full description</Label>
          <Textarea
            id="full-description"
            rows={5}
            value={formData.fullDescription}
            onChange={(event) =>
              updateField("fullDescription", event.target.value)
            }
          />
        </div>
      </AddStudioSection>

      <AddStudioSection
        step={2}
        title="Location"
        hint="The exact address is only shared with confirmed renters."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(event) => updateField("country", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(event) => updateField("city", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Area / Neighborhood</Label>
            <Input
              id="area"
              value={formData.area}
              onChange={(event) => updateField("area", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street-address">Street address</Label>
            <Input
              id="street-address"
              value={formData.streetAddress}
              onChange={(event) =>
                updateField("streetAddress", event.target.value)
              }
            />
          </div>
        </div>
      </AddStudioSection>

      <AddStudioSection step={3} title="Pricing">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="hourly-rate">Hourly rate (৳) *</Label>
            <Input
              id="hourly-rate"
              type="number"
              min="0"
              value={formData.hourlyRate}
              onChange={(event) =>
                updateField("hourlyRate", event.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimum-hours">Minimum hours</Label>
            <Input
              id="minimum-hours"
              type="number"
              min="1"
              value={formData.minimumHours}
              onChange={(event) =>
                updateField("minimumHours", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cleaning-fee">Cleaning fee (৳)</Label>
            <Input
              id="cleaning-fee"
              type="number"
              min="0"
              value={formData.cleaningFee}
              onChange={(event) =>
                updateField("cleaningFee", event.target.value)
              }
            />
          </div>
        </div>
      </AddStudioSection>

      <AddStudioSection step={4} title="Capacity">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="max-guests">Maximum guests *</Label>
            <Input
              id="max-guests"
              type="number"
              min="1"
              value={formData.maxGuests}
              onChange={(event) => updateField("maxGuests", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studio-size">Studio size (sq ft)</Label>
            <Input
              id="studio-size"
              type="number"
              min="0"
              value={formData.studioSize}
              onChange={(event) =>
                updateField("studioSize", event.target.value)
              }
            />
          </div>
        </div>
      </AddStudioSection>

      <AddStudioSection step={5} title="Amenities">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIO_AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary/50"
            >
              <Checkbox
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={() => toggleArrayItem("amenities", amenity)}
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </AddStudioSection>

      <AddStudioSection step={6} title="Photos">
        <AddStudioPhotos
          photos={formData.photos}
          onChange={(photos) => updateField("photos", photos)}
          onBusyChange={setPhotosBusy}
        />
      </AddStudioSection>

      <AddStudioSection step={7} title="Opening hours & availability">
        <AvailabilityFields
          openingHours={formData.openingHours}
          unavailableDate={formData.unavailableDate}
          validationError={scheduleError}
          onDayChange={updateOpeningHours}
          onUnavailableDateChange={(value) =>
            updateField("unavailableDate", value)
          }
        />
      </AddStudioSection>

      <AddStudioSection step={8} title="Rules">
        <div className="space-y-2">
          <Label>Cancellation policy</Label>
          <Select
            value={formData.cancellationPolicy}
            onValueChange={(value) =>
              updateField("cancellationPolicy", value ?? "")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a policy" />
            </SelectTrigger>
            <SelectContent>
              {STUDIO_CANCELLATION_POLICIES.map((policy) => (
                <SelectItem key={policy} value={policy}>
                  {policy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studio-rules">Studio rules (one per line)</Label>
          <Textarea
            id="studio-rules"
            rows={5}
            value={formData.studioRules}
            onChange={(event) => updateField("studioRules", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-instructions">
            Additional instructions
          </Label>
          <Textarea
            id="additional-instructions"
            rows={3}
            value={formData.additionalInstructions}
            onChange={(event) =>
              updateField("additionalInstructions", event.target.value)
            }
          />
        </div>
      </AddStudioSection>

      <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-end gap-3 border-t border-border bg-background/80 px-4 py-4 backdrop-blur-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isBusy}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isBusy}
        >
          {pendingAction === "draft" ? <Spinner /> : null}
          Save as Draft
        </Button>
        <Button type="submit" disabled={isBusy}>
          {pendingAction === "save" ? <Spinner /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
