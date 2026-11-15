import { cn } from "@/lib/utils"

/** Two-arrow "switch" icon. The arrows are separate shapes so they can swap places.
 *  They animate only on press: while a parent with the `group` class is pressed,
 *  or while `switching` is true (styles in app/animations.css). */
export function SwitchIcon({
  switching = false,
  className,
}: {
  switching?: boolean
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("switch-icon", switching && "is-switching", className)}
    >
      <g className="switch-arrow-a">
        <path d="M8 3 4 7l4 4" />
        <path d="M4 7h16" />
      </g>
      <g className="switch-arrow-b">
        <path d="m16 21 4-4-4-4" />
        <path d="M20 17H4" />
      </g>
    </svg>
  )
}