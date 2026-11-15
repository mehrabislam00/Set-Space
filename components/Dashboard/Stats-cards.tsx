import { dashboardStats } from "@/lib/Dashboard-data"

export function StatsCards() {
  return (
    <section aria-label="Account summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {dashboardStats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover sm:gap-4 sm:p-5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary sm:size-12">
            <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted-foreground">{label}</p>
            <p className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              {value}
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}