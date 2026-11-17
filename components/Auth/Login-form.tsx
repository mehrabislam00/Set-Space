"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { MIN_PASSWORD } from "@/lib/Site-data"

import { PasswordInput } from "./Password-input"
import { SocialAuth } from "./Social-auth"

type Errors = { email?: string; password?: string }
type AuthError = { message?: string; code?: string; status?: number }

/** Email / password sign-in with validation and server error handling. */
export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [errors, setErrors] = React.useState<Errors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  function clearError(field?: keyof Errors) {
    setFormError(null)
    if (field) {
      setErrors((previous) =>
        previous[field] ? { ...previous, [field]: undefined } : previous
      )
    }
  }

  function showServerError(error: AuthError) {
    const message = error.message ?? ""

    if (/invalid (email|password)|incorrect|unauthorized/i.test(message)) {
      setFormError("Email or password is incorrect.")
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
    if (loading) return
    setFormError(null)

    const next: Errors = {}
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) next.email = "Enter your email address."
    else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail))
      next.email = "Enter a valid email address."
    if (!password) next.password = "Enter your password."
    else if (password.length < MIN_PASSWORD)
      next.password = `Password must be at least ${MIN_PASSWORD} characters.`

    setErrors(next)
    if (next.email || next.password) return

    setLoading(true)
    try {
      const { error } = await authClient.signIn.email({
        email: normalizedEmail,
        password,
        rememberMe: remember,
      })

      if (error) {
        showServerError(error)
        return
      }

      router.push("/")
    } catch {
      setFormError(
        "We couldn't reach the server. Check your connection and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stagger-in mt-8" style={{ animationDelay: "120ms" }}>
      <SocialAuth />

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs text-muted-foreground">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@studio.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearError("email")
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-10 rounded-xl"
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-[11px] text-destructive"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs text-muted-foreground">
            Password
          </Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              clearError("password")
            }}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="h-10 rounded-xl"
          />
          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="text-[11px] text-destructive"
            >
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label
            htmlFor="remember"
            className="cursor-pointer gap-2.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-primary"
          >
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(v) => setRemember(v === true)}
              className="rounded-full"
            />
            Remember me
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >
            Forgot password?
          </Link>
        </div>

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
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"
        >
          Register
        </Link>
      </p>
    </div>
  )
}
