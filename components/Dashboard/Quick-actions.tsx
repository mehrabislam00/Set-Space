import Link from "next/link"

import { quickActions } from "@/lib/Dashboard-data"

export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading">
      <h2
        id="quick-actions-heading"
        className="font-heading text-lg font-extrabold tracking-tight text-foreground"
      >
        Quick actions
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickActions.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 outline-none transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <Icon
              className="size-5 text-primary transition-transform duration-300 group-hover:scale-110"
              strokeWidth={1.5}
            />
            <span className="font-heading text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-sm">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}