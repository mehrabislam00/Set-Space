import type { Metadata } from "next"

import heroStudio from "@/assets/hero-studio.jpg"
import { LoginForm } from "@/components/Auth/Login-form"
import { AuthShell } from "@/components/Auth/Auth-shell"


export const metadata: Metadata = {
  title: "Sign In — SetSpace",
  description: "Sign in to book studios or manage your listings on SetSpace.",
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back"
      description="Sign in to your account to continue"
      image={heroStudio}
      imageAlt="Photography studio with a cinema camera on a tripod"
      eyebrow="Create. Rent. Inspire."
      headline="The set is ready when you are."
    >
      <LoginForm />
    </AuthShell>
  )
}