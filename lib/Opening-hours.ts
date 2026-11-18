export const STUDIO_WEEKDAYS = [
  { key: "Mon", label: "Monday" },
  { key: "Tue", label: "Tuesday" },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday" },
  { key: "Fri", label: "Friday" },
  { key: "Sat", label: "Saturday" },
  { key: "Sun", label: "Sunday" },
] as const

export type StudioWeekday = (typeof STUDIO_WEEKDAYS)[number]["key"]

export type DailyOpeningHours = {
  opens: string
  closes: string
  closed: boolean
}

export type WeeklyOpeningHours = Record<StudioWeekday, DailyOpeningHours>

const WEEKDAY_KEYS = STUDIO_WEEKDAYS.map((day) => day.key)

export const DEFAULT_WEEKLY_OPENING_HOURS: WeeklyOpeningHours = {
  Mon: { opens: "08:00", closes: "22:00", closed: false },
  Tue: { opens: "08:00", closes: "22:00", closed: false },
  Wed: { opens: "08:00", closes: "22:00", closed: false },
  Thu: { opens: "08:00", closes: "22:00", closed: false },
  Fri: { opens: "08:00", closes: "22:00", closed: false },
  Sat: { opens: "08:00", closes: "22:00", closed: false },
  Sun: { opens: "08:00", closes: "22:00", closed: true },
}

function isValidTime(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

function timeInMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  return hours * 60 + minutes
}

export function cloneWeeklyOpeningHours(
  hours: WeeklyOpeningHours
): WeeklyOpeningHours {
  return Object.fromEntries(
    STUDIO_WEEKDAYS.map(({ key }) => [key, { ...hours[key] }])
  ) as WeeklyOpeningHours
}

export function getLegacyOpeningHours(
  availableDays?: readonly string[],
  opens?: string,
  closes?: string
): WeeklyOpeningHours {
  const days =
    availableDays ?? STUDIO_WEEKDAYS.slice(0, 6).map(({ key }) => key)
  const openDays = new Set(days)
  if (days.some((day) => !STUDIO_WEEKDAYS.some(({ key }) => key === day))) {
    throw new Error("The studio has invalid legacy available days.")
  }
  if (
    days.length > 0 &&
    (!isValidTime(opens) ||
      !isValidTime(closes) ||
      timeInMinutes(closes) <= timeInMinutes(opens))
  ) {
    throw new Error("The studio has invalid legacy opening hours.")
  }
  const openTime = isValidTime(opens) ? opens : "08:00"
  const closeTime = isValidTime(closes) ? closes : "22:00"

  return Object.fromEntries(
    STUDIO_WEEKDAYS.map(({ key }) => [
      key,
      {
        opens: openTime,
        closes: closeTime,
        closed: !openDays.has(key),
      },
    ])
  ) as WeeklyOpeningHours
}

export function resolveWeeklyOpeningHours(
  value: unknown,
  availableDays?: readonly string[],
  opens?: string,
  closes?: string
): WeeklyOpeningHours {
  if (value === undefined || value === null) {
    return getLegacyOpeningHours(availableDays, opens, closes)
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("The studio has an invalid weekly opening schedule.")
  }

  const schedule = value as Record<string, unknown>
  const resolved = {} as WeeklyOpeningHours

  for (const { key, label } of STUDIO_WEEKDAYS) {
    const day = schedule[key]
    if (!day || typeof day !== "object" || Array.isArray(day)) {
      throw new Error(`Opening hours are missing for ${label}.`)
    }

    const entry = day as Record<string, unknown>
    if (
      typeof entry.closed !== "boolean" ||
      !isValidTime(entry.opens) ||
      !isValidTime(entry.closes) ||
      (!entry.closed &&
        timeInMinutes(entry.closes) <= timeInMinutes(entry.opens))
    ) {
      throw new Error(`Opening hours are invalid for ${label}.`)
    }

    resolved[key] = {
      opens: entry.opens,
      closes: entry.closes,
      closed: entry.closed,
    }
  }

  return resolved
}

export function validateWeeklyOpeningHours(
  schedule: WeeklyOpeningHours,
  requireOpenDay = false
) {
  let openDays = 0

  for (const { key, label } of STUDIO_WEEKDAYS) {
    const day = schedule[key]
    if (!day || typeof day.closed !== "boolean") {
      return `Choose valid opening hours for ${label}.`
    }
    if (!isValidTime(day.opens) || !isValidTime(day.closes)) {
      return `Choose valid opening and closing times for ${label}.`
    }
    if (day.closed) continue
    openDays += 1
    if (timeInMinutes(day.closes) <= timeInMinutes(day.opens)) {
      return `${label}: closing time must be later than opening time. Overnight hours are not supported.`
    }
  }

  if (requireOpenDay && openDays === 0) {
    return "Open at least one day before publishing this studio."
  }
  return null
}

export function formatStudioTime(value: string) {
  if (!isValidTime(value)) return "—"
  const minutes = timeInMinutes(value)
  const hours = Math.floor(minutes / 60)
  return `${String(hours % 12 || 12).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`
}

export function getCurrentStudioOpeningStatus(
  schedule: WeeklyOpeningHours,
  now: Date
) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const weekday = parts.find((part) => part.type === "weekday")?.value
  const hours = Number(parts.find((part) => part.type === "hour")?.value)
  const minutes = Number(parts.find((part) => part.type === "minute")?.value)
  const day = WEEKDAY_KEYS.find((key) => key === weekday) ?? "Sun"
  const today = schedule[day]
  const nowInMinutes = hours * 60 + minutes

  return {
    day,
    today,
    openNow:
      !today.closed &&
      nowInMinutes >= timeInMinutes(today.opens) &&
      nowInMinutes < timeInMinutes(today.closes),
  }
}
