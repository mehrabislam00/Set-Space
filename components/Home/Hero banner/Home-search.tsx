"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { UnavailableDatePicker } from "@/components/Host/Unavailable-date-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories, categoryKeyMap } from "@/lib/Site-data"

/** Hero search bar. On submit it opens /explore-studio with the filters in the
 *  URL: ?q=<text>&category=<photo|film|podcast|music|art|content>&date=<yyyy-mm-dd>
 *  (category uses the same keys as the home "Browse by discipline" links). */
export function HomeSearch() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState(categories[0])
  const [date, setDate] = React.useState("")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())

    const categoryKey = Object.entries(categoryKeyMap).find(
      ([, label]) => label === category
    )?.[0]
    if (categoryKey) params.set("category", categoryKey)

    if (date) params.set("date", date)

    const qs = params.toString()
    router.push(qs ? `/explore-studio?${qs}` : "/explore-studio")
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="stagger-in mt-12 flex max-w-4xl flex-col gap-2 rounded-xl border border-white/10 bg-black/50 p-2 backdrop-blur-md md:flex-row md:items-center md:gap-0"
      style={{ animationDelay: "220ms" }}
    >
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
        <Input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search studios or cities"
          placeholder="Search studios or cities..."
          className="h-10 border-0 bg-transparent pl-9 text-photo shadow-none placeholder:text-photo-muted/70 focus-visible:ring-0 dark:bg-transparent"
        />
      </div>

      <div className="hidden h-8 w-px bg-white/10 md:block" />

      <Select value={category} onValueChange={(v) => v && setCategory(v)}>
        <SelectTrigger
          aria-label="Category"
          className="h-10 w-full justify-between border-0 bg-transparent px-4 text-sm text-photo shadow-none focus-visible:ring-0 md:w-48 dark:bg-transparent dark:hover:bg-white/5 [&_svg]:text-photo-muted"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          sideOffset={14}
          className="min-w-48 rounded-xl border-border bg-popover p-1.5 text-popover-foreground shadow-2xl"
        >
          {categories.map((c) => (
            <SelectItem
              key={c}
              value={c}
              className="rounded-md py-2 text-xs focus:bg-accent focus:text-accent-foreground"
            >
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="hidden h-8 w-px bg-white/10 md:block" />

      <div className="md:mx-2 md:w-48">
        <UnavailableDatePicker
          id="search-date"
          value={date}
          onChange={setDate}
          className="!border-white/20  hover:!border-white/30 data-[popup-open]:!border-white/30"
        />
      </div>

      <Button type="submit" size="lg" className="md:ml-2">
        Search
      </Button>
    </form>
  )
}