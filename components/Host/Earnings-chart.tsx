import { monthlyEarnings } from "@/lib/Host-data"
import { cn } from "@/lib/utils"

const max = Math.max(...monthlyEarnings.map((m) => m.amount))
const GRID_LINES = 4

/** Bar chart of monthly earnings.
 *  Hover (or focus) a bar: it lifts and glows, the other bars dim, and a tooltip
 *  shows the amount and the change from the previous month. */
export function EarningsChart() {
  return (
    <section
      aria-labelledby="earnings-heading"
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="earnings-heading"
          className="font-heading text-sm font-bold text-foreground"
        >
          Monthly earnings
        </h2>
        <p className="text-[11px] text-muted-foreground">Sample data</p>
      </div>

      {/* top margin leaves room for the tooltip above the tallest bar */}
      <div className="relative mt-12">
        {/* dashed guide lines (same height as the bars area) */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 flex h-48 flex-col justify-between"
        >
          {Array.from({ length: GRID_LINES }).map((_, i) => (
            <div key={i} className="border-t border-dashed border-border/60" />
          ))}
        </div>

        <ul className="group/chart relative grid grid-cols-6 gap-3 sm:gap-6">
          {monthlyEarnings.map(({ month, amount }, i) => {
            const prev = monthlyEarnings[i - 1]
            const delta = prev
              ? Math.round(((amount - prev.amount) / prev.amount) * 100)
              : null

            return (
              <li
                key={month}
                tabIndex={0}
                aria-label={`${month}: $${amount}`}
                className="group/bar flex cursor-default flex-col items-center gap-2 outline-none transition-opacity duration-300 group-hover/chart:opacity-40 hover:opacity-100! focus-visible:opacity-100! motion-reduce:transition-none"
              >
                <div className="flex h-48 w-full items-end">
                  <div
                    className="bar-grow relative w-full rounded-t-lg bg-gradient-to-t from-primary/70 to-primary transition-[filter,translate,box-shadow] duration-300 group-hover/bar:-translate-y-1 group-hover/bar:shadow-[0_14px_30px_-10px_color-mix(in_srgb,var(--primary)_70%,transparent)] group-hover/bar:brightness-110 group-focus-visible/bar:-translate-y-1 group-focus-visible/bar:brightness-110 motion-reduce:transition-none"
                    style={{
                      height: `${(amount / max) * 100}%`,
                      animationDelay: `${i * 70}ms`,
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-center whitespace-nowrap opacity-0 shadow-xl transition-[opacity,translate] duration-200 group-hover/bar:translate-y-0 group-hover/bar:opacity-100 group-focus-visible/bar:translate-y-0 group-focus-visible/bar:opacity-100"
                    >
                      <span className="block font-heading text-xs font-bold text-foreground">
                        ${amount}
                      </span>
                      {delta !== null && (
                        <span
                          className={cn(
                            "block text-[10px] font-medium",
                            delta >= 0 ? "text-success" : "text-destructive"
                          )}
                        >
                          {delta >= 0 ? "+" : ""}
                          {delta}% vs {prev.month}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-muted-foreground transition-colors duration-300 group-hover/bar:text-primary group-focus-visible/bar:text-primary">
                  {month}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}