"use client"

import * as React from "react"

import { authClient } from "@/lib/auth-client"
import {
  getProfileImageUrl,
  getMyProfile,
  type ProfileResponse,
  type UserProfile,
} from "@/lib/Marketplace-api"
import {
  deleteProfileAvatarCache,
  readProfileAvatarCache,
  writeProfileAvatarCache,
} from "@/lib/Profile-avatar-cache"

type LoadedProfile = {
  userId: string
  account: ProfileResponse
  error: null
}

type FailedProfile = {
  userId: string
  account: null
  error: string
}

type ProfileState = LoadedProfile | FailedProfile
type CachedAvatar = {
  userId: string
  url: string
}

export type PendingProfilePhoto = {
  file: File
  previewUrl: string
  userId: string
}

type PendingPhotoInput = Omit<PendingProfilePhoto, "userId">

type AccountProfileContextValue = {
  account: ProfileResponse | null
  loading: boolean
  authLoading: boolean
  userId: string | null
  error: string | null
  user: {
    name: string
    email: string
    initials: string
    image: string | null
  } | null
  pendingPhoto: PendingProfilePhoto | null
  setPendingPhoto: (photo: PendingPhotoInput | null) => void
  clearPendingPhoto: (photo: PendingProfilePhoto) => void
  retry: () => void
  updateProfile: (profile: UserProfile, avatarFile?: File) => void
}

const AccountProfileContext =
  React.createContext<AccountProfileContextValue | null>(null)

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "SS"
  )
}

function getAvatarVersion(image: string | null, updatedAt: string | null) {
  return `${encodeURIComponent(image ?? "")}:${encodeURIComponent(updatedAt ?? "")}`
}

export function AccountProfileProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isPending } = authClient.useSession()
  const userId = session?.user.id
  const [profileState, setProfileState] = React.useState<ProfileState | null>(
    null
  )
  const [retryCount, setRetryCount] = React.useState(0)
  const [pendingPhotoState, setPendingPhotoState] =
    React.useState<PendingProfilePhoto | null>(null)
  const [cachedAvatar, setCachedAvatar] = React.useState<CachedAvatar | null>(
    null
  )
  const [avatarCacheLoadingUserId, setAvatarCacheLoadingUserId] =
    React.useState<string | null>(null)
  const avatarCacheGeneration = React.useRef(0)

  React.useEffect(() => {
    return () => {
      if (pendingPhotoState) URL.revokeObjectURL(pendingPhotoState.previewUrl)
    }
  }, [pendingPhotoState])

  React.useEffect(() => {
    return () => {
      if (cachedAvatar) URL.revokeObjectURL(cachedAvatar.url)
    }
  }, [cachedAvatar])

  React.useEffect(() => {
    if (!userId) return

    const controller = new AbortController()
    let active = true
    const generation = ++avatarCacheGeneration.current
    const cacheAvatar = (blob: Blob) => {
      if (!active || generation !== avatarCacheGeneration.current) return
      setCachedAvatar({ userId, url: URL.createObjectURL(blob) })
    }

    const cachedAvatarPromise = readProfileAvatarCache(userId).catch(
      (error: unknown) => {
        console.warn("Could not read the cached profile avatar.", error)
        return null
      }
    )
    cachedAvatarPromise.then((cached) => {
      if (cached && active) cacheAvatar(cached.blob)
    })

    const syncAvatar = async (account: ProfileResponse) => {
      try {
        const image = account.profile.image
        if (!image) {
          if (active) {
            setCachedAvatar((current) =>
              current?.userId === userId ? null : current
            )
          }
          await deleteProfileAvatarCache(userId)
          return
        }

        const imageUrl = getProfileImageUrl(image)
        if (!imageUrl) return

        const version = getAvatarVersion(image, account.profile.updatedAt)
        const cached = await cachedAvatarPromise
        if (!active) return
        if (cached?.version === version) {
          return
        }

        if (
          new URL(imageUrl, window.location.origin).origin !==
          window.location.origin
        ) {
          setCachedAvatar((current) =>
            current?.userId === userId ? null : current
          )
          await deleteProfileAvatarCache(userId)
          return
        }

        const response = await fetch(imageUrl, {
          credentials: "include",
          cache: "reload",
          signal: controller.signal,
        })
        if (
          !response.ok ||
          !response.headers.get("content-type")?.startsWith("image/")
        ) {
          return
        }

        const blob = await response.blob()
        if (!active || generation !== avatarCacheGeneration.current) return
        await writeProfileAvatarCache(userId, blob, version)
        cacheAvatar(blob)
      } catch (error) {
        if (controller.signal.aborted) return
        console.warn("Could not refresh the cached profile avatar.", error)
      } finally {
        if (active) {
          setAvatarCacheLoadingUserId((current) =>
            current === userId ? null : current
          )
        }
      }
    }

    getMyProfile(controller.signal)
      .then((account) => {
        if (!active) return
        setAvatarCacheLoadingUserId(account.profile.image ? userId : null)
        setProfileState({ userId, account, error: null })
        void syncAvatar(account)
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) return
        setProfileState({
          userId,
          account: null,
          error:
            error instanceof Error
              ? error.message
              : "Could not load your account profile.",
        })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [retryCount, userId])

  const activeState = profileState?.userId === userId ? profileState : null
  const account = activeState?.account ?? null
  const pendingPhoto =
    pendingPhotoState?.userId === userId ? pendingPhotoState : null
  const profileName = account?.profile.name.trim()
  const name = profileName || session?.user.name || "SetSpace member"
  const user = session
    ? {
        name,
        email:
          account?.profile.email || account?.user.email || session.user.email,
        initials: getInitials(name),
        image:
          (cachedAvatar && cachedAvatar.userId === userId
            ? cachedAvatar.url
            : null) ??
          (avatarCacheLoadingUserId === userId
            ? null
            : account
              ? getProfileImageUrl(account.profile.image)
              : null),
      }
    : null

  const retry = React.useCallback(() => {
    setRetryCount((count) => count + 1)
  }, [])

  const setPendingPhoto = React.useCallback(
    (photo: PendingPhotoInput | null) => {
      if (photo) {
        if (userId) setPendingPhotoState({ ...photo, userId })
        return
      }

      setPendingPhotoState((current) =>
        current?.userId === userId ? null : current
      )
    },
    [userId]
  )

  const clearPendingPhoto = React.useCallback((photo: PendingProfilePhoto) => {
    setPendingPhotoState((current) => (current === photo ? null : current))
  }, [])

  const updateProfile = React.useCallback(
    (profile: UserProfile, avatarFile?: File) => {
      if (!userId) return
      setProfileState((current) => {
        if (current?.userId !== userId || !current.account) return current
        return {
          userId,
          account: { ...current.account, profile },
          error: null,
        }
      })

      if (avatarFile) {
        avatarCacheGeneration.current += 1
        const version = getAvatarVersion(profile.image, profile.updatedAt)
        setCachedAvatar({ userId, url: URL.createObjectURL(avatarFile) })
        writeProfileAvatarCache(userId, avatarFile, version).catch(
          (error: unknown) => {
            console.warn("Could not save the updated profile avatar.", error)
          }
        )
      }
    },
    [userId]
  )

  return (
    <AccountProfileContext.Provider
      value={{
        account,
        loading: isPending || (!!userId && !activeState),
        authLoading: isPending,
        userId: userId ?? null,
        error: activeState?.error ?? null,
        user,
        pendingPhoto,
        setPendingPhoto,
        clearPendingPhoto,
        retry,
        updateProfile,
      }}
    >
      {children}
    </AccountProfileContext.Provider>
  )
}

export function useAccountProfile() {
  const context = React.useContext(AccountProfileContext)
  if (!context) {
    throw new Error(
      "useAccountProfile must be used within an AccountProfileProvider."
    )
  }
  return context
}
