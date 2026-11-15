import type { Metadata } from "next"

import studioLoft from "@/assets/studio-loft.jpg"
import { AuthShell } from "@/components/Auth/Auth-shell"
import { RegisterForm } from "@/components/Auth/Register-form"


export const metadata: Metadata = {
  title: "Create Account — SetSpace",
  description: "One SetSpace account to rent studios and host your own.",
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="One account to rent and host studios"
      image={studioLoft}
      imageAlt="Brick loft studio with a leather armchair and softbox light"
      eyebrow="Create. Rent. Inspire."
      headline="The set is ready when you are."
    >
      <RegisterForm />
    </AuthShell>
  )
}