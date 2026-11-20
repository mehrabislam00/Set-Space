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
  type HostOnboardingStatus,
  updateHostOnboardingProgress,
} from "@/lib/Marketplace-api"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Become a Host",
    heading: "Start Your Hosting Journey",
    description:
      "Welcome to SetSpace! Become a host and start sharing your studio with people looking for the perfect space.",
    icon: Briefcase,
    actions: [
      "Create an account and sign in.",
      "Explore hosting and renter workflows.",
      "Prepare your studio information.",
    ],
    tip: "Hosting gives your studio more visibility and lets you manage every booking from one dashboard.",
  },
  {
    title: "Complete Your Profile",
    heading: "Build Your Host Profile",
    description:
      "Create a trustworthy host profile so renters can understand who you are and feel confident connecting with you.",
    icon: User,
    actions: [
      "Add your profile picture.",
      "Provide your name and contact information.",
      "Add a short introduction or bio.",
      "Keep your profile details accurate and current.",
    ],
    tip: "A complete profile helps build trust with potential renters.",
  },
  {
    title: "Add Your Studio",
    heading: "Showcase Your Studio",
    description:
      "Add your studio to SetSpace and help potential renters discover your space.",
    icon: Building2,
    actions: [
      "Upload high-quality studio images.",
      "Add a descriptive studio title.",
      "Select the correct category and amenities.",
      "Set the location, pricing, and availability.",
    ],
    tip: "Clear photos and specific details make your listing easier to compare.",
  },
  {
    title: "Publish When Ready",
    heading: "Make Your Studio Discoverable",
    description:
      "Review your studio listing and publish it when you are satisfied with the information.",
    icon: Check,
    actions: [
      "Review studio information.",
      "Check images and descriptions.",
      "Verify pricing and availability.",
      "Publish your listing when ready.",
    ],
    tip: "You can keep a listing in draft until it is ready.",
  },
  {
    title: "Manage Bookings",
    heading: "Stay on Top of Your Bookings",
    description:
      "Manage incoming booking requests and keep track of your studio reservations.",
    icon: Inbox,
    actions: [
      "View booking requests.",
      "Review renter information.",
      "Check requested dates and times.",
      "Track pending and confirmed bookings.",
    ],
    tip: "Check notifications regularly so requests are not left waiting.",
  },
  {
    title: "Confirm or Reject",
    heading: "You're in Control of Your Bookings",
    description:
      "Review booking requests and decide whether to accept or decline them.",
    icon: CalendarDays,
    actions: [
      "Review booking details.",
      "Confirm suitable booking requests.",
      "Reject requests when necessary.",
      "Keep availability information up to date.",
    ],
    tip: "Prompt responses create a better experience for renters.",
  },
  {
    title: "Manage Your Studio",
    heading: "Keep Your Studio Updated",
    description:
      "Maintain your studio listing and make sure renters always see accurate information.",
    icon: Settings,
    actions: [
      "Update studio descriptions.",
      "Change photos and amenities.",
      "Modify pricing and availability.",
      "Manage published listing information.",
    ],
    tip: "Updated listings reduce questions and scheduling conflicts.",
  },
  {
    title: "Track Your Activity",
    heading: "Track Your Hosting Performance",
    description:
      "Monitor your hosting activity and understand how your studio is performing.",
    icon: LayoutDashboard,
    actions: [
      "Review total bookings.",
      "Track pending requests.",
      "Monitor confirmed bookings.",
      "Review earnings statistics.",
    ],
    tip: "Use the Host Dashboard to understand trends in your activity.",
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
  const ActiveIcon = steps[activeStep].icon
  const progress =
    activeStep === 0 ? 0 : (activeStep / (steps.length - 1)) * 100

  function navigateToStep(step: number) {
    const nextStep = Math.max(0, Math.min(steps.length - 1, step))
    if (nextStep === activeStep) return

    const visitedSteps = new Set([
      ...onboarding.completedSteps,
      ...Array.from({ length: nextStep + 1 }, (_, index) => index + 1),
    ])

    onStatusChange({
      ...onboarding,
      currentStep: nextStep,
      completedSteps: Array.from(visitedSteps).sort((a, b) => a - b),
    })

    void updateHostOnboardingProgress(nextStep).catch(() => {})
  }

  function finishHosting() {
    toast.add({
      title: "Hosting journey complete",
      description: "Opening your host dashboard.",
      type: "success",
    })
    router.push("/host/dashboard")
    void completeHostOnboarding()
      .then(onStatusChange)
      .catch(() => {})
  }

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
                const isComplete =
                  !isActive && onboarding.completedSteps.includes(index + 1)

                return (
                  <li key={step.title} className="shrink-0 md:shrink">
                    <button
                      type="button"
                      aria-label={`Step ${index + 1}: ${step.title}`}
                      aria-current={isActive ? "step" : undefined}
                      onClick={() => navigateToStep(index)}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border text-xs font-semibold transition-colors md:h-auto md:w-full md:justify-start md:gap-3 md:rounded-xl md:px-3 md:py-2.5 md:text-left",
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
              className="rounded-2xl border border-border bg-muted/30 p-5 sm:p-6"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-background text-primary shadow-sm">
                <ActiveIcon className="size-5" />
              </div>
              <h2 className="mt-4 font-heading text-lg font-bold text-foreground">
                {steps[activeStep].heading}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {steps[activeStep].description}
              </p>

              <ul className="mt-4 space-y-2">
                {steps[activeStep].actions.map((action) => (
                  <li
                    key={action}
                    className="flex items-start gap-2.5 text-sm leading-5 text-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
                <p className="text-xs font-semibold text-warning">
                  Helpful tip
                </p>
                <p className="mt-1 text-sm leading-5 text-foreground/80">
                  {steps[activeStep].tip}
                </p>
              </div>
            </section>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={activeStep === 0}
              onClick={() => navigateToStep(activeStep - 1)}
            >
              <ArrowLeft />
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() => navigateToStep(activeStep + 1)}
              >
                Next Step
                <ArrowRight />
              </Button>
            ) : (
              <Button type="button" onClick={finishHosting}>
                Finish &amp; Go to Dashboard
                <Check />
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
