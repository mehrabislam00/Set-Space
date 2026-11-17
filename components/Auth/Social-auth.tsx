"use client"

import * as React from "react"
import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

/** "Continue with Google" button + "or continue with email" divider,
 *  shared by the Login and Register forms. */
export function SocialAuth() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function signInWithGoogle() {
    if (loading) return

    setError(null)
    setLoading(true)

    try {
      const { error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      if (socialError) {
        setError(socialError.message || "Google sign-in failed.")
        setLoading(false)
      }
    } catch {
      setError("We couldn't start Google sign-in. Please try again.")
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={loading}
        onClick={signInWithGoogle}
        className="btn-alive h-11 w-full rounded-xl text-xs font-semibold"
      >
        {loading ? (
          "Connecting to Google..."
        ) : (
          <>
            <FcGoogle className="size-4" />
            Continue with Google
          </>
        )}
      </Button>

      {error && (
        <p role="alert" className="mt-2 text-center text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="my-6 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>
    </>
  )
}
