"use client"

import * as React from "react"

import { authClient } from "@/lib/auth-client"
import {
  getProfileImageUrl,
  getMyProfile,
  type ProfileResponse,
  type UserProfile,
} from "@/lib/Marketplace-api"

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
  updateProfile: (profile: UserProfile) => void
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

  React.useEffect(() => {
    return () => {
      if (pendingPhotoState) URL.revokeObjectURL(pendingPhotoState.previewUrl)
    }
  }, [pendingPhotoState])

  React.useEffect(() => {
    if (!userId) return

    const controller = new AbortController()
    getMyProfile(controller.signal)
      .then((account) => {
        setProfileState({ userId, account, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setProfileState({
          userId,
          account: null,
          error:
            error instanceof Error
              ? error.message
              : "Could not load your account profile.",
        })
      })

    return () => controller.abort()
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
        image: account ? getProfileImageUrl(account.profile.image) : null,
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
    (profile: UserProfile) => {
      if (!userId || !account) return
      setProfileState({
        userId,
        account: { ...account, profile },
        error: null,
      })
    },
    [account, userId]
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
