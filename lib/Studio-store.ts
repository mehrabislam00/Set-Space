"use client"

import * as React from "react"
import { useSyncExternalStore } from "react"

import { authClient } from "@/lib/auth-client"
import {
  createStudio,
  deleteStudio,
  getMyStudioById,
  getMyStudios,
  updateStudio,
  updateStudioStatus,
} from "@/lib/Marketplace-api"
import type {
  HostStudio,
  HostStudioStatus,
  StudioFormData,
} from "@/lib/Host-data"
import { toHostStudio } from "@/lib/Studio-api"

type StudioStateStatus = "loading" | "ready" | "error" | "unauthenticated"

type StudioState = {
  userId: string | null
  status: StudioStateStatus
  studios: HostStudio[]
  error: string | null
}

const serverSnapshot: StudioState = {
  userId: null,
  status: "loading",
  studios: [],
  error: null,
}

let snapshot = serverSnapshot
const listeners = new Set<() => void>()
let loadVersion = 0

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function publish(next: StudioState) {
  snapshot = next
  listeners.forEach((listener) => listener())
}

function loadStudios(userId: string, force = false) {
  if (
    !force &&
    snapshot.userId === userId &&
    (snapshot.status === "ready" || snapshot.status === "loading")
  ) {
    return
  }

  const version = ++loadVersion
  publish({
    userId,
    status: "loading",
    studios: snapshot.userId === userId ? snapshot.studios : [],
    error: null,
  })

  getMyStudios()
    .then((records) => {
      if (
        version !== loadVersion ||
        snapshot.userId !== userId ||
        snapshot.status !== "loading"
      ) {
        return
      }
      publish({
        userId,
        status: "ready",
        studios: records.map(toHostStudio),
        error: null,
      })
    })
    .catch((error: unknown) => {
      if (
        version !== loadVersion ||
        snapshot.userId !== userId ||
        snapshot.status !== "loading"
      ) {
        return
      }
      publish({
        userId,
        status: "error",
        studios: [],
        error:
          error instanceof Error
            ? error.message
            : "Could not load your studios.",
      })
    })
}

function updateSnapshot(
  userId: string | undefined,
  updater: (studios: HostStudio[]) => HostStudio[]
) {
  if (!userId || snapshot.userId !== userId) return
  if (snapshot.status !== "ready") {
    loadStudios(userId, true)
    return
  }
  publish({ ...snapshot, studios: updater(snapshot.studios) })
}

export function useHostStudios() {
  const { data: session, isPending } = authClient.useSession()
  const userId = session?.user.id ?? null
  const state = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot
  )

  React.useEffect(() => {
    if (isPending) return
    if (userId) {
      loadStudios(userId)
      return
    }

    if (snapshot.status !== "unauthenticated" || snapshot.userId !== null) {
      publish({
        userId: null,
        status: "unauthenticated",
        studios: [],
        error: null,
      })
    }
  }, [isPending, userId])

  const retry = React.useCallback(() => {
    if (userId && !isPending) loadStudios(userId, true)
  }, [isPending, userId])

  if (state.userId !== userId) {
    return {
      ...serverSnapshot,
      status: isPending ? "loading" : userId ? "loading" : "unauthenticated",
      retry,
    }
  }

  return { ...state, retry }
}

type StudioSaveStatus = "Published" | "Draft"

function apiStatus(status: StudioSaveStatus) {
  return status === "Published" ? "published" : "draft"
}

export async function createHostStudio(
  details: StudioFormData,
  status: StudioSaveStatus
) {
  const record = await createStudio(details, apiStatus(status))
  const studio = toHostStudio(record)
  updateSnapshot(record.ownerId, (studios) => [studio, ...studios])
  return studio
}

export async function fetchHostStudio(id: string) {
  return toHostStudio(await getMyStudioById(id))
}

type UpdateStudioOptions = {
  status?: HostStudioStatus
}

export async function updateHostStudio(
  id: string,
  details: StudioFormData,
  options: UpdateStudioOptions = {}
) {
  const record = await updateStudio(
    id,
    details,
    options.status ? apiStatus(options.status) : undefined
  )
  const studio = toHostStudio(record)
  updateSnapshot(record.ownerId, (studios) =>
    studios.map((current) => (current.id === id ? studio : current))
  )
  return studio
}

export async function setHostStudioStatus(
  id: string,
  status: HostStudioStatus
) {
  const record = await updateStudioStatus(id, apiStatus(status))
  const studio = toHostStudio(record)
  updateSnapshot(record.ownerId, (studios) =>
    studios.map((current) => (current.id === id ? studio : current))
  )
}

export async function deleteHostStudio(id: string) {
  const userId = snapshot.userId ?? undefined
  await deleteStudio(id)
  updateSnapshot(userId, (studios) =>
    studios.filter((studio) => studio.id !== id)
  )
}
