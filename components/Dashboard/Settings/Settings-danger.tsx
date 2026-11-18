"use client"

import * as React from "react"
import Link from "next/link"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { SettingsSection } from "./Settings-section"

export function SettingsDanger() {
  const [open, setOpen] = React.useState(false)

  function onOpenChange(next: boolean) {
    setOpen(next)
  }

  return (
    <SettingsSection
      id="delete-account"
      title="Account deletion"
      description="Request removal of your account and marketplace data"
    >
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="btn-alive h-8 rounded-lg border-destructive/40 px-3 text-[11px] font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        Request deletion
      </Button>

      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request account deletion?</AlertDialogTitle>
            <AlertDialogDescription>
              Self-service deletion is not available yet. Send a request through
              our contact form; no account data will be removed from this
              screen.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction render={<Link href="/contact" />}>
              Contact support
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  )
}
