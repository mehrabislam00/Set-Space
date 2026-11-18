"use client"

import { Check, Loader2 } from "lucide-react"
import * as React from "react"

import { PasswordInput } from "@/components/Auth/Password-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { authClient, signOutCurrentUser } from "@/lib/auth-client"
import { MIN_PASSWORD } from "@/lib/Site-data"
import { SettingsSection } from "./Settings-section"
import { useRouter } from "next/navigation"

type Errors = { current?: string; next?: string; confirm?: string }

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-[11px] text-destructive">
      {message}
    </p>
  )
}

export function SettingsSecurity() {
  const router = useRouter()
  const [current, setCurrent] = React.useState("")
  const [next, setNext] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [errors, setErrors] = React.useState<Errors>({})
  const [loading, setLoading] = React.useState(false)
  const [signingOut, setSigningOut] = React.useState(false)
  const [updated, setUpdated] = React.useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUpdated(false)

    const found: Errors = {}
    if (!current) found.current = "Enter your current password."
    if (next.length < MIN_PASSWORD)
      found.next = `New password must be at least ${MIN_PASSWORD} characters.`
    else if (next === current)
      found.next = "New password must be different from the current one."
    if (confirm !== next) found.confirm = "Passwords don't match."
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setLoading(true)
    try {
      const { error } = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
        revokeOtherSessions: true,
      })
      if (error) {
        toast.add({
          title: "Password not updated",
          description:
            error.message || "Check your current password and retry.",
          type: "error",
        })
        return
      }

      setCurrent("")
      setNext("")
      setConfirm("")
      setUpdated(true)
      toast.add({
        title: "Password updated",
        description: "Your new password is ready to use.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "Password not updated",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOutCurrentUser()
      toast.add({ title: "Signed out", type: "success" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast.add({
        title: "Could not sign out",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <SettingsSection
      id="security"
      title="Security"
      description="Change your password or sign out"
    >
      <form onSubmit={onSubmit} noValidate className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="current-password"
            className="text-xs text-muted-foreground"
          >
            Current password
          </Label>
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            aria-invalid={!!errors.current}
            aria-describedby={errors.current ? "current-error" : undefined}
            className="h-10"
          />
          <FieldError id="current-error" message={errors.current} />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="new-password"
            className="text-xs text-muted-foreground"
          >
            New password
          </Label>
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            aria-invalid={!!errors.next}
            aria-describedby={errors.next ? "new-error" : undefined}
            className="h-10"
          />
          <FieldError id="new-error" message={errors.next} />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirm-password"
            className="text-xs text-muted-foreground"
          >
            Confirm new password
          </Label>
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
            className="h-10"
          />
          <FieldError id="confirm-error" message={errors.confirm} />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="btn-alive"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Updating..." : "Change Password"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="btn-alive"
            disabled={signingOut}
            onClick={onSignOut}
          >
            {signingOut && <Loader2 className="size-4 animate-spin" />}
            {signingOut ? "Signing out..." : "Sign Out"}
          </Button>

          {updated && (
            <p
              role="status"
              className="flex items-center gap-1.5 text-xs text-success"
            >
              <Check className="size-3.5" />
              Password updated
            </p>
          )}
        </div>
      </form>
    </SettingsSection>
  )
}
