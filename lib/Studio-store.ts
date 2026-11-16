"use client"

import { useSyncExternalStore } from "react"

import {
  hostStudios,
  type HostStudio,
  type HostStudioStatus,
  type StudioFormData,
} from "@/lib/Host-data"

/**
 * Small client-side store for the host's studio listings.
 *
 * The project is currently front-end only, so this module is the single
 * "service" boundary the UI talks to. Replace the bodies of the exported
 * functions with API calls when the studio endpoints exist; components and
 * their data flow stay the same.
 */

const STORAGE_KEY = "setspace.host-studios.v1"
const FETCH_DELAY = 350
const SAVE_DELAY = 500

/** Singular badge text for each category used by the form. */
const CATEGORY_BADGES: Record<string, string> = {
  "Photo Studios": "Photo Studio",
  "Music Studios": "Music Suite",
  "Podcast Studios": "Podcast Room",
  "Film Studios": "Film Stage",
  "Content Creation Studios": "Content Studio",
  "Art Studios": "Art Workshop",
}

let snapshot: HostStudio[] | null = null
const listeners = new Set<() => void>()

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

function readStoredStudios(): HostStudio[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as HostStudio[]) : null
  } catch {
    return null
  }
}

function getSnapshot(): HostStudio[] {
  if (typeof window === "undefined") return hostStudios
  snapshot ??= readStoredStudios() ?? hostStudios
  return snapshot
}

function getServerSnapshot(): HostStudio[] {
  return hostStudios
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function commit(next: HostStudio[]) {
  snapshot = next

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage can be unavailable (private mode / quota); keep the in-memory
    // snapshot so edits still work for the rest of the session.
  }

  listeners.forEach((listener) => listener())
}

function coverImage(current: HostStudio["image"], photos: string[]) {
  const cover = photos[0]
  // Object URLs cannot be restored after a reload, so keep the previous cover.
  if (!cover || cover.startsWith("blob:")) return current
  return cover
}

/** Keep the My Studios summary fields in sync with the form data. */
function toSummary(details: StudioFormData) {
  return {
    name: details.name.trim(),
    category: CATEGORY_BADGES[details.category] ?? details.category,
    city: details.city.trim(),
    price: Number(details.hourlyRate) || 0,
  }
}

/** Current listings, kept in sync across every component using the hook. */
export function useHostStudios() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function getHostStudio(id: string) {
  return getSnapshot().find((studio) => studio.id === id)
}

/** Simulates the GET /studios/:id request so the page can show a loader. */
export async function fetchHostStudio(
  id: string
): Promise<HostStudio | undefined> {
  await wait(FETCH_DELAY)
  return getHostStudio(id)
}

type UpdateStudioOptions = {
  status?: HostStudioStatus
}

/** Simulates PATCH /studios/:id — updates the existing record in place. */
export async function updateHostStudio(
  id: string,
  details: StudioFormData,
  options: UpdateStudioOptions = {}
): Promise<HostStudio> {
  await wait(SAVE_DELAY)

  const studios = getSnapshot()
  const current = studios.find((studio) => studio.id === id)

  if (!current) {
    throw new Error("This studio could not be found. It may have been deleted.")
  }

  const updated: HostStudio = {
    ...current,
    ...toSummary(details),
    status: options.status ?? current.status,
    details: {
      ...details,
      amenities: [...details.amenities],
      photos: [...details.photos],
      availableDays: [...details.availableDays],
    },
    image: coverImage(current.image, details.photos),
  }

  commit(studios.map((studio) => (studio.id === id ? updated : studio)))
  return updated
}

/** Publish / unpublish from My Studios. */
export function setHostStudioStatus(id: string, status: HostStudioStatus) {
  commit(
    getSnapshot().map((studio) =>
      studio.id === id ? { ...studio, status } : studio
    )
  )
}

export function deleteHostStudio(id: string) {
  commit(getSnapshot().filter((studio) => studio.id !== id))
}
