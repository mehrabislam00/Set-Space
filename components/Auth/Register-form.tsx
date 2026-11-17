"use client"

import { Check, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { MIN_PASSWORD } from "@/lib/Site-data"
import { cn } from "@/lib/utils"
import { PasswordInput } from "./Password-input"
import { SocialAuth } from "./Social-auth"

type Field = "name" | "email" | "password" | "confirm" | "terms"
type Errors = Partial<Record<Field, string>>

/** Order used to focus the first invalid field. */
const FIELD_ORDER: Field[] = ["name", "email", "password", "confirm", "terms"]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const REDIRECT_DELAY = 1400

const linkClass =
  "text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-[11px] text-destructive">
      {message}
    </p>
  )
}

type Values = {
  name: string
  email: string
  password: string
  confirm: string
  agreed: boolean
}

function validate(values: Values): Errors {
  const errors: Errors = {}
  const name = values.name.trim()
  const email = values.email.trim()

  if (!name) errors.name = "Enter your full name."
  else if (name.length < 2) errors.name = "Name must be at least 2 characters."

  if (!email) errors.email = "Enter your email address."
  else if (!EMAIL_PATTERN.test(email))
    errors.email = "Enter a valid email address."

  if (!values.password) errors.password = "Create a password."
  else if (values.password.length < MIN_PASSWORD)
    errors.password = `Password must be at least ${MIN_PASSWORD} characters.`

  if (!values.confirm) errors.confirm = "Confirm your password."
  else if (values.confirm !== values.password)
    errors.confirm = "Passwords don't match."

  if (!values.agreed)
    errors.terms = "Please accept the Terms and Privacy Policy."

  return errors
}

/** Shape of the error returned by `authClient` (better-auth style). */
type AuthError = { message?: string; code?: string; status?: number }

/** Account creation form with validation, loading and success states. */
export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [agreed, setAgreed] = React.useState(false)
  const [errors, setErrors] = React.useState<Errors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const redirectTimer = React.useRef<number | undefined>(undefined)
  const pendingFocus = React.useRef<Field | null>(null)

  const values: Values = { name, email, password, confirm, agreed }

  // Inputs are disabled while submitting, so focus is applied once they are
  // enabled again.
  React.useEffect(() => {
    if (loading || !pendingFocus.current) return
    document.getElementById(pendingFocus.current)?.focus()
    pendingFocus.current = null
  }, [loading])

  React.useEffect(() => () => window.clearTimeout(redirectTimer.current), [])

  function clearError(field: Field) {
    setFormError(null)
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  /** Validate one text field when the user leaves it (skips empty fields). */
  function validateOnBlur(field: Exclude<Field, "terms">) {
    if (!values[field]) return
    const message = validate(values)[field]
    setErrors((prev) => ({ ...prev, [field]: message }))
  }

  function showServerError(error: AuthError) {
    const code = error.code ?? ""
    const message = error.message ?? ""

    if (
      code.startsWith("USER_ALREADY_EXISTS") ||
      /already (exists|registered|in use)/i.test(message)
    ) {
      setErrors({ email: "An account with this email already exists." })
      pendingFocus.current = "email"
      return
    }
    if (error.status === 429) {
      setFormError("Too many attempts. Please wait a moment and try again.")
      return
    }
    setFormError(message || "Something went wrong. Please try again.")
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading || success) return // ignore double submits
    setFormError(null)

    const next = validate(values)
    setErrors(next)
    const firstInvalid = FIELD_ORDER.find((field) => next[field])
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

    setLoading(true)
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim().replace(/\s+/g, " "),
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        showServerError(error)
        return
      }

      setSuccess(true)
      redirectTimer.current = window.setTimeout(
        () => router.push("/"),
        REDIRECT_DELAY
      )
    } catch {
      setFormError(
        "We couldn't reach the server. Check your connection and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        role="status"
        className="stagger-in mt-8 flex flex-col items-center gap-3 py-6 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-6" />
        </span>
        <h2 className="font-heading text-lg font-bold text-foreground">
          Account created
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Welcome to SetSpace, {name.trim().split(/\s+/)[0]}. Taking you to the
          homepage...
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ size: "lg" }), "btn-alive mt-2")}
        >
          Continue to SetSpace
        </Link>
      </div>
    )
  }

  return (
    <div className="stagger-in mt-8" style={{ animationDelay: "120ms" }}>
      <SocialAuth />

      <form
        onSubmit={onSubmit}
        noValidate
        aria-busy={loading}
        className="space-y-5"
      >
        <fieldset disabled={loading} className="min-w-0 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs text-muted-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              maxLength={60}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearError("name")
              }}
              onBlur={() => validateOnBlur("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="h-10 rounded-xl"
            />
            <FieldError id="name-error" message={errors.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              maxLength={254}
              placeholder="you@studio.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearError("email")
              }}
              onBlur={() => validateOnBlur("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-10 rounded-xl"
            />
            <FieldError id="email-error" message={errors.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs text-muted-foreground">
              Password
            </Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              maxLength={128}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearError("password")
                // keep the confirm field honest if it was already filled in
                if (confirm) clearError("confirm")
              }}
              onBlur={() => validateOnBlur("password")}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : "password-hint"
              }
              className="h-10 rounded-xl"
            />
            {errors.password ? (
              <FieldError id="password-error" message={errors.password} />
            ) : (
              <p
                id="password-hint"
                className="text-[11px] text-muted-foreground"
              >
                At least {MIN_PASSWORD} characters.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-xs text-muted-foreground">
              Confirm Password
            </Label>
            <PasswordInput
              id="confirm"
              name="confirm"
              autoComplete="new-password"
              maxLength={128}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value)
                clearError("confirm")
              }}
              onBlur={() => validateOnBlur("confirm")}
              aria-invalid={!!errors.confirm}
              aria-describedby={errors.confirm ? "confirm-error" : undefined}
              className="h-10 rounded-xl"
            />
            <FieldError id="confirm-error" message={errors.confirm} />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="terms"
              className="cursor-pointer gap-2.5 text-xs text-muted-foreground"
            >
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(v) => {
                  setAgreed(v === true)
                  clearError("terms")
                }}
                aria-invalid={!!errors.terms}
                aria-describedby={errors.terms ? "terms-error" : undefined}
                className="rounded-full"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className={linkClass}>
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className={linkClass}>
                  Privacy Policy
                </Link>
              </span>
            </Label>
            <FieldError id="terms-error" message={errors.terms} />
          </div>
        </fieldset>

        {formError && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive"
          >
            {formError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="btn-alive h-10 w-full rounded-xl"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"
        >
          Sign In
        </Link>
      </p>
    </div>
  )
}