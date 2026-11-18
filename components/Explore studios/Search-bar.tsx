"use client"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories } from "@/lib/Site-data"
import type { Filters } from "@/lib/Studio-filters"

type Props = {
  filters: Filters
  locations: string[]
  update: (patch: Partial<Filters>) => void
  onSearch?: () => void
}

const triggerClass =
  "h-10 w-full justify-between border-0 bg-transparent px-4 text-sm shadow-none focus-visible:ring-0 md:w-52 dark:bg-transparent dark:hover:bg-white/5"

const contentClass =
  "min-w-48 rounded-xl border-border bg-popover p-1.5 text-popover-foreground shadow-2xl"

const itemClass =
  "rounded-md py-2 text-xs focus:bg-accent focus:text-accent-foreground"

export function SearchBar({ filters, locations, update, onSearch }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch?.()
      }}
      className="flex flex-col gap-2 rounded-2xl border border-border bg-card/90 p-2 backdrop-blur-md md:flex-row md:items-center md:gap-0"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary" />
        <Input
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          placeholder="Search studios, cities..."
          aria-label="Search studios or cities"
          className="h-10 border-0 bg-transparent pl-10 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
      </div>

      <div className="hidden h-8 w-px bg-border md:block" />

      <Select
        value={filters.category}
        onValueChange={(v) => v && update({ category: v })}
      >
        <SelectTrigger aria-label="Category" className={triggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent sideOffset={12} className={contentClass}>
          {categories.map((c) => (
            <SelectItem key={c} value={c} className={itemClass}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="hidden h-8 w-px bg-border md:block" />

      <Select
        value={filters.location}
        onValueChange={(v) => v && update({ location: v })}
      >
        <SelectTrigger aria-label="Location" className={triggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent sideOffset={12} className={contentClass}>
          {["All Locations", ...locations].map((l) => (
            <SelectItem key={l} value={l} className={itemClass}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" size="lg" className="btn-alive md:ml-2">
        Search
      </Button>
    </form>
  )
}
