"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsSection } from "./Settings-section"

const CONFIRM_WORD = "DELETE"

/** Delete-account row. The dialog asks the user to type DELETE before it enables the action. */
export function SettingsDanger() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [typed, setTyped] = React.useState("")

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setTyped("")
  }

  function deleteAccount() {
    // TODO: call your delete-account API, then clear the session
    router.push("/")
  }

  return (
    <SettingsSection
      id="delete-account"
      title="Delete account"
      description="Permanently remove your account and all of its data"
    >
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="btn-alive h-8 rounded-lg border-destructive/40 px-3 text-[11px] font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        Delete account
      </Button>

      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your profile, bookings, saved studios
              and listings. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="confirm-delete" className="text-xs text-muted-foreground">
              Type {CONFIRM_WORD} to confirm
            </Label>
            <Input
              id="confirm-delete"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              className="h-10"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Keep account</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={typed !== CONFIRM_WORD}
              onClick={deleteAccount}
            >
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  )
}