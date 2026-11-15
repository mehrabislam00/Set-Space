"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { PasswordInput } from "./Password-input"
import { SocialAuth } from "./Social-auth"
import { MIN_PASSWORD } from "@/lib/Site-data"

type Errors = { email?: string; password?: string }

/** Email / password sign-in. Demo only: replace the TODOs with your auth calls. */
export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [errors, setErrors] = React.useState<Errors>({})
  const [loading, setLoading] = React.useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const next: Errors = {}
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address."
    if (password.length < MIN_PASSWORD)
      next.password = `Password must be at least ${MIN_PASSWORD} characters.`

    setErrors(next)
    if (next.email || next.password) return

    // TODO: call your sign-in API with { email, password, remember }
    setLoading(true)
    window.setTimeout(() => router.push("/"), 700)
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
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-10 rounded-xl"
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-[11px] text-destructive">
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
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="h-10 rounded-xl"
          />
          {errors.password && (
            <p id="password-error" role="alert" className="text-[11px] text-destructive">
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
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Demo: any email + {MIN_PASSWORD}-character password works.
      </p>
    </div>
  )
}