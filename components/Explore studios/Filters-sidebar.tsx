"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import {
  amenitiesList,
  categories,
  priceRanges,
  ratingOptions,
} from "@/lib/Site-data"
import {
  PRICE_MAX,
  defaultFilters,
  hasActiveFilters,
  type Filters,
} from "@/lib/Studio-filters"
import { cn } from "@/lib/utils"

type Props = {
  filters: Filters
  update: (patch: Partial<Filters>) => void
  onClear: () => void
}

const optionClass =
  "flex cursor-pointer items-center gap-2.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-primary"

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-heading text-xs font-bold text-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

export function FiltersSidebar({ filters, update, onClear }: Props) {
  const { priceMin, priceMax } = filters
  const priceLabel = `$${priceMin} - ${
    priceMax >= PRICE_MAX ? `$${PRICE_MAX}+` : `$${priceMax}`
  }`

  function toggleAmenity(name: string) {
    update({
      amenities: filters.amenities.includes(name)
        ? filters.amenities.filter((a) => a !== name)
        : [...filters.amenities, name],
    })
  }

  return (
    <aside className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-foreground">
          Filter by
        </h2>
        {hasActiveFilters(filters) && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <Group title="Category">
        <RadioGroup
          value={filters.category}
          onValueChange={(v) => update({ category: String(v) })}
          className="gap-3"
        >
          {categories.slice(1).map((c) => (
            <Label
              key={c}
              htmlFor={`cat-${c}`}
              className={optionClass}
              onClick={(e) => {
                // clicking the selected option again turns it off
                if (filters.category === c) {
                  e.preventDefault()
                  update({ category: defaultFilters.category })
                }
              }}
            >
              <RadioGroupItem id={`cat-${c}`} value={c} />
              {c}
            </Label>
          ))}
        </RadioGroup>
      </Group>

      {/* Price */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold text-foreground">
            Price per hour
          </h3>
          <span className="text-[11px] text-muted-foreground">{priceLabel}</span>
        </div>
        <Slider
          min={0}
          max={PRICE_MAX}
          step={5}
          value={[priceMin, priceMax]}
          onValueChange={(v) => {
            const [a, b] = Array.isArray(v) ? v : [v, priceMax]
            update({ priceMin: Math.min(a, b), priceMax: Math.max(a, b) })
          }}
          aria-label="Price per hour"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {priceRanges.map((r) => {
            const active = priceMin === r.min && priceMax === r.max
            return (
              <Button
                key={r.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => update({ priceMin: r.min, priceMax: r.max })}
                className={cn(
                  "btn-flat h-7 rounded-lg px-2.5 text-[11px]",
                  active && "border-primary bg-accent text-primary"
                )}
              >
                {r.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Rating */}
      <Group title="Rating">
        <RadioGroup
          value={filters.rating ? String(filters.rating) : ""}
          onValueChange={(v) => update({ rating: Number(v) })}
          className="gap-3"
        >
          {ratingOptions.map((r) => (
            <Label
              key={r.value}
              htmlFor={`rating-${r.value}`}
              className={optionClass}
              onClick={(e) => {
                if (filters.rating === r.value) {
                  e.preventDefault()
                  update({ rating: 0 })
                }
              }}
            >
              <RadioGroupItem id={`rating-${r.value}`} value={String(r.value)} />
              {r.label}
            </Label>
          ))}
        </RadioGroup>
      </Group>

      {/* Amenities */}
      <Group title="Amenities">
        <div className="space-y-3">
          {amenitiesList.map((a) => (
            <Label key={a} htmlFor={`am-${a}`} className={optionClass}>
              <Checkbox
                id={`am-${a}`}
                checked={filters.amenities.includes(a)}
                onCheckedChange={() => toggleAmenity(a)}
              />
              {a}
            </Label>
          ))}
        </div>
      </Group>
    </aside>
  )
}