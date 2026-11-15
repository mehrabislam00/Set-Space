"use client"

import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button"

/** "Continue with Google" button + "or continue with email" divider,
 *  shared by the Login and Register forms. */
export function SocialAuth() {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="btn-alive h-11 w-full rounded-xl text-xs font-semibold"
        // TODO: start the Google OAuth flow
      >
        <FcGoogle className="size-4" />
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>
    </>
  )
}