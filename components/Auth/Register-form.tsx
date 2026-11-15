"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MIN_PASSWORD } from "@/lib/Site-data"
import { PasswordInput } from "./Password-input"
import { SocialAuth } from "./Social-auth"


type Errors = {
  name?: string
  email?: string
  password?: string
  confirm?: string
  terms?: string
}

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

/** Account creation form. Demo only: replace the TODOs with your auth calls. */
export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [agreed, setAgreed] = React.useState(false)
  const [errors, setErrors] = React.useState<Errors>({})
  const [loading, setLoading] = React.useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const next: Errors = {}
    if (!name.trim()) next.name = "Enter your full name."
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address."
    if (password.length < MIN_PASSWORD)
      next.password = `Password must be at least ${MIN_PASSWORD} characters.`
    if (confirm !== password) next.confirm = "Passwords don't match."
    if (!agreed) next.terms = "Please accept the Terms and Privacy Policy."

    setErrors(next)
    if (Object.keys(next).length > 0) return

    // TODO: call your sign-up API with { name, email, password }
    setLoading(true)
    window.setTimeout(() => router.push("/"), 700)
  }

  return (
    <div className="stagger-in mt-8" style={{ animationDelay: "120ms" }}>
      <SocialAuth />

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs text-muted-foreground">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="h-10 rounded-xl"
          />
          <FieldError id="password-error" message={errors.password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm" className="text-xs text-muted-foreground">
            Confirm Password
          </Label>
          <PasswordInput
            id="confirm"
            name="confirm"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
              onCheckedChange={(v) => setAgreed(v === true)}
              aria-invalid={!!errors.terms}
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