"use client"

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  Inbox,
  LayoutDashboard,
  Loader2,
  Settings,
  User,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import {
  completeHostOnboarding,
  getHostOnboardingStatus,
  MarketplaceApiError,
  type HostOnboardingStatus,
  updateHostOnboardingProgress,
} from "@/lib/Marketplace-api"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Become a Host",
    description:
      "Use your SetSpace account to list creative spaces and manage incoming booking requests.",
    icon: Briefcase,
  },
  {
    title: "Complete Your Profile",
    description:
      "Make sure your profile has your name. Your phone, location, and bio are optional.",
    icon: User,
  },
  {
    title: "Add Your Studio",
    description:
      "Add studio details, photos, facilities, location, hourly pricing, and weekly availability.",
    icon: Building2,
  },
  {
    title: "Publish When Ready",
    description:
      "Keep a listing as a hidden draft, or publish it once the required listing details are complete. Publishing is automatic; no staff approval queue is configured.",
    icon: Check,
  },
  {
    title: "Manage Bookings",
    description:
      "New renter requests appear in Booking Requests and your notifications.",
    icon: Inbox,
  },
  {
    title: "Confirm or Reject",
    description:
      "Review each pending request and confirm or reject it. Renters can cancel pending or confirmed bookings.",
    icon: CalendarDays,
  },
  {
    title: "Manage Your Studio",
    description:
      "Edit studio information, photos, pricing, opening hours, or return a published listing to draft.",
    icon: Settings,
  },
  {
    title: "Track Your Activity",
    description:
      "Use the Host Dashboard to review studio and booking totals, pending requests, and earnings statistics.",
    icon: LayoutDashboard,
  },
]

type AccessState =
  | { status: "error"; userId: string; message: string }
  | {
      status: "ready"
      userId: string
      onboarding: HostOnboardingStatus
    }

function LoadingState() {
  return (
    <div
      role="status"
      aria-label="Checking host access"
      className="grid min-h-[calc(100svh-8rem)] place-items-center"
    >
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  )
}

function HostGateFrame({
  children,
  showHostSkeleton = false,
}: {
  children: React.ReactNode
  showHostSkeleton?: boolean
}) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      {showHostSkeleton && (
        <div
          aria-hidden="true"
          className="pointer-events-none mx-auto max-w-6xl px-5 pt-24 pb-6 opacity-40 blur-[1px] sm:px-8 sm:pt-28"
        >
          <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
            <aside className="hidden space-y-4 lg:block">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-3.5 w-24 rounded bg-muted" />
                  <div className="h-3 w-32 rounded bg-muted" />
                </div>
              </div>
              <div className="h-9 w-full rounded-xl bg-muted" />
              <div className="space-y-2 pt-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="h-9 w-full rounded-xl bg-muted" />
                ))}
              </div>
            </aside>
            <div className="space-y-6">
              <div className="h-8 w-52 rounded bg-muted" />
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="h-28 rounded-2xl bg-muted" />
                ))}
              </div>
              <div className="h-64 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

function HostAccessMessage({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto grid min-h-[50svh] max-w-lg place-items-center">
      <div className="w-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <h1 className="font-heading text-xl font-bold text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <div className="mt-6 flex justify-center gap-3">{children}</div>
      </div>
    </div>
  )
}

function HostOnboardingDialog({
  onboarding,
  onStatusChange,
}: {
  onboarding: HostOnboardingStatus
  onStatusChange: (status: HostOnboardingStatus) => void
}) {
  const router = useRouter()
  const activeStep = onboarding.currentStep
  const [completing, setCompleting] = React.useState(false)
  const [completionError, setCompletionError] = React.useState("")
  const actionLock = React.useRef(false)
  const completedCount = onboarding.completedSteps.length
  const progress = (completedCount / steps.length) * 100
  const ActiveIcon = steps[activeStep].icon

  function beginAction() {
    if (actionLock.current) return false
    actionLock.current = true
    setCompleting(true)
    return true
  }

  function finishAction() {
    actionLock.current = false
    setCompleting(false)
  }

  async function startHosting() {
    if (!beginAction()) return
    setCompletionError("")

    try {
      const currentStatus = await getHostOnboardingStatus()
      onStatusChange(currentStatus)

      if (currentStatus.hasHostedStudio || currentStatus.onboardingCompleted) {
        return
      }

      if (!currentStatus.profileComplete) {
        const profileStep = await updateHostOnboardingProgress(1)
        onStatusChange(profileStep)
        setCompletionError(
          "Complete your profile first to continue your hosting journey."
        )
        return
      }

      const result = await completeHostOnboarding()
      onStatusChange(result)

      if (!result.onboardingCompleted && !result.hasHostedStudio) {
        throw new Error("Something went wrong. Please try again.")
      }

      toast.add({
        title: "You're ready to host",
        description: "Your host dashboard is ready to use.",
        type: "success",
      })
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } finally {
      finishAction()
    }
  }

  async function continueOnboarding() {
    if (!beginAction()) return
    setCompletionError("")

    try {
      const currentStatus = await getHostOnboardingStatus()
      onStatusChange(currentStatus)

      if (!currentStatus.profileComplete) {
        router.push("/dashboard/profile")
        return
      }

      const nextStep = Math.min(steps.length - 1, currentStatus.currentStep + 1)
      const updatedStatus = await updateHostOnboardingProgress(nextStep)
      onStatusChange(updatedStatus)
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Could not verify your profile. Please try again.",
          type: "error",
        })
      }
    } finally {
      finishAction()
    }
  }

  async function goToStep(step: number) {
    if (step === activeStep || !beginAction()) return
    setCompletionError("")
    try {
      const status = await updateHostOnboardingProgress(step)
      onStatusChange(status)
    } catch (error) {
      if (!(error instanceof MarketplaceApiError)) {
        toast.add({
          title: "Could not update your hosting journey. Please try again.",
          type: "error",
        })
      }
    } finally {
      finishAction()
    }
  }

  const missingProfileText = onboarding.missingFields.includes("name")
    ? "Complete your profile first to continue your hosting journey. Your full name must be 1–80 characters."
    : ""

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/30 supports-backdrop-filter:backdrop-blur-sm dark:bg-black/45"
        className="flex max-h-[88svh] max-w-3xl flex-col gap-0 overflow-y-auto p-0 sm:max-w-3xl"
      >
        <div className="space-y-5 p-5 sm:space-y-6 sm:p-7">
          <header className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                Hosting on SetSpace
              </p>
              <DialogTitle className="mt-1 font-heading text-xl font-bold sm:text-2xl">
                Your hosting journey, step by step
              </DialogTitle>
              <DialogDescription className="mt-2 leading-6">
                A quick guide to listing a studio and managing bookings.
              </DialogDescription>
            </div>
          </header>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-foreground">
                Step {activeStep + 1} of {steps.length}
              </span>
              <span className="text-muted-foreground">
                {completedCount} of {steps.length} milestones verified
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Onboarding progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              className="h-1.5 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] md:gap-6">
            <ol
              aria-label="Hosting workflow steps"
              className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
            >
              {steps.map((step, index) => {
                const isActive = activeStep === index
                const isComplete = onboarding.completedSteps.includes(index + 1)
                const isLocked =
                  index > activeStep + 1 ||
                  (index > 1 && !onboarding.profileComplete)

                return (
                  <li key={step.title} className="shrink-0 md:shrink">
                    <button
                      type="button"
                      aria-label={`Step ${index + 1}: ${step.title}`}
                      aria-current={isActive ? "step" : undefined}
                      disabled={isLocked || completing}
                      onClick={() => void goToStep(index)}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 md:h-auto md:w-full md:justify-start md:gap-3 md:rounded-xl md:px-3 md:py-2.5 md:text-left",
                        isActive
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : isComplete
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <span className="grid size-5 shrink-0 place-items-center">
                        {isComplete ? <Check className="size-4" /> : index + 1}
                      </span>
                      <span className="hidden min-w-0 truncate md:block">
                        {step.title}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <section
              aria-live="polite"
              className="min-h-56 rounded-2xl border border-border bg-muted/30 p-5 sm:p-6"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-background text-primary shadow-sm">
                <ActiveIcon className="size-5" />
              </div>
              <h2 className="mt-4 font-heading text-lg font-bold text-foreground">
                {steps[activeStep].title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {steps[activeStep].description}
              </p>

              {activeStep === 1 && (
                <div
                  className={cn(
                    "mt-5 rounded-xl border p-4",
                    onboarding.profileComplete
                      ? "border-success/20 bg-success/5"
                      : "border-warning/30 bg-warning/5"
                  )}
                >
                  {onboarding.profileComplete ? (
                    <p className="text-sm leading-6 text-foreground">
                      Your profile has a valid name. Phone, location, and bio
                      are optional and can be added later.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm leading-6 text-foreground">
                        {missingProfileText ||
                          "Complete the required profile information before starting."}{" "}
                        Phone, location, and bio are optional.
                      </p>
                      <Button
                        render={<Link href="/dashboard/profile" />}
                        nativeButton={false}
                        size="sm"
                        className="mt-3"
                      >
                        Complete Profile
                        <ArrowRight />
                      </Button>
                    </>
                  )}
                </div>
              )}

              {activeStep === steps.length - 1 &&
                !onboarding.profileComplete && (
                  <div className="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-4">
                    <p className="text-sm leading-6 text-foreground">
                      {missingProfileText ||
                        "Complete your required profile information before starting."}{" "}
                      Phone, location, and bio are optional.
                    </p>
                    <Button
                      render={<Link href="/dashboard/profile" />}
                      nativeButton={false}
                      size="sm"
                      className="mt-3"
                    >
                      Complete Profile
                      <ArrowRight />
                    </Button>
                  </div>
                )}

              {completionError && (
                <p role="alert" className="mt-4 text-sm text-destructive">
                  {completionError}
                </p>
              )}
            </section>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={activeStep === 0 || completing}
              onClick={() => void goToStep(Math.max(0, activeStep - 1))}
            >
              <ArrowLeft />
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                disabled={completing}
                onClick={continueOnboarding}
              >
                {completing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
                {completing
                  ? "Checking..."
                  : onboarding.profileComplete
                    ? "Continue"
                    : "Complete Profile"}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={completing}
                onClick={startHosting}
              >
                {completing ? <Loader2 className="animate-spin" /> : <Check />}
                {completing ? "Starting..." : "Get Started"}
              </Button>
            )}
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function HostOnboardingGate({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isPending } = authClient.useSession()
  const userId = session?.user.id ?? null
  const [retryCount, setRetryCount] = React.useState(0)
  const [access, setAccess] = React.useState<AccessState | null>(null)

  React.useEffect(() => {
    if (isPending || !userId) return

    const controller = new AbortController()

    getHostOnboardingStatus(controller.signal)
      .then((onboarding) => {
        setAccess({ status: "ready", userId, onboarding })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setAccess({
          status: "error",
          userId,
          message:
            error instanceof Error
              ? error.message
              : "Could not verify host access.",
        })
      })

    return () => controller.abort()
  }, [isPending, retryCount, userId])

  if (isPending || (userId && access?.userId !== userId)) {
    return (
      <HostGateFrame>
        <LoadingState />
      </HostGateFrame>
    )
  }

  if (!userId) {
    return (
      <HostGateFrame>
        <HostAccessMessage
          title="Sign in to start hosting"
          description="Sign in to your SetSpace account to access host tools."
        >
          <Button render={<Link href="/login" />} nativeButton={false}>
            Sign In
          </Button>
        </HostAccessMessage>
      </HostGateFrame>
    )
  }

  if (!access || access.userId !== userId) {
    return <LoadingState />
  }

  if (access.status === "error") {
    return (
      <HostGateFrame>
        <HostAccessMessage
          title="Could not verify host access"
          description={access.message}
        >
          <Button
            onClick={() => {
              setAccess(null)
              setRetryCount((count) => count + 1)
            }}
          >
            Try Again
          </Button>
        </HostAccessMessage>
      </HostGateFrame>
    )
  }

  if (
    access.onboarding.onboardingCompleted ||
    access.onboarding.hasHostedStudio
  ) {
    return children
  }

  return (
    <HostGateFrame showHostSkeleton>
      <HostOnboardingDialog
        onboarding={access.onboarding}
        onStatusChange={(onboarding) =>
          setAccess({ status: "ready", userId: access.userId, onboarding })
        }
      />
    </HostGateFrame>
  )
}
