import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? process.env.BETTER_AUTH_URL
      : window.location.origin,
})

export const { signIn, signUp, useSession } = authClient

export async function signOutCurrentUser() {
  const { error } = await authClient.signOut()
  if (error) {
    throw new Error(error.message || "Could not sign out. Please try again.")
  }
}

/** The signed-in user returned by Better Auth's session. */
export type SessionUser = NonNullable<
  ReturnType<typeof authClient.useSession>["data"]
>["user"]
