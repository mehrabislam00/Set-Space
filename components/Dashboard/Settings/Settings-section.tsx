import { cn } from "@/lib/utils"

type SettingsSectionProps = {
  id: string
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

/** One settings row: title + hint on the left, controls on the right (stacked on mobile). */
export function SettingsSection({
  id,
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={cn(
        "grid gap-4 border-b border-border py-7 first:pt-0 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8",
        className
      )}
    >
      <div>
        <h2
          id={`${id}-heading`}
          className="font-heading text-sm font-bold text-foreground"
        >
          {title}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}