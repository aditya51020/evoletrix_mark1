// Single source of truth for booking-calendar timing rules. This module has no
// browser-only or Node-only dependencies, so it is imported unmodified by both
// the frontend (BookingModal) and the backend (api/index.js, server.js) --
// that's what keeps "now" and "is this slot bookable" consistent everywhere.

// The timezone the business calendar operates in, independent of where a
// visitor or the server happens to be. Evoletrix is based in Faridabad, Haryana.
export const BUSINESS_TIMEZONE = "Asia/Kolkata"

// A meeting cannot be booked less than this many minutes from now.
export const MIN_BOOKING_NOTICE_MINUTES = 120

// Configured meeting slots. `time` is the canonical 24h key used for storage
// and comparisons; `label` is what's shown in the UI.
export const TIME_SLOTS = [
  { time: "10:00", label: "10:00 AM" },
  { time: "10:30", label: "10:30 AM" },
  { time: "11:00", label: "11:00 AM" },
  { time: "11:30", label: "11:30 AM" },
  { time: "14:00", label: "02:00 PM" },
  { time: "14:30", label: "02:30 PM" },
  { time: "15:00", label: "03:00 PM" },
  { time: "15:30", label: "03:30 PM" },
]

export function getSlotLabel(time) {
  return TIME_SLOTS.find((slot) => slot.time === time)?.label || time
}

// Returns the current wall-clock date/time in the given IANA timezone, computed
// fresh from Date.now() every call -- never cached or hardcoded. Using
// Intl.DateTimeFormat with an explicit timeZone avoids manual UTC-offset math
// (and its DST bugs) entirely.
export function getNowInTimeZone(timeZone = BUSINESS_TIMEZONE) {
  const now = new Date()
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now)

  const map = {}
  for (const part of parts) map[part.type] = part.value

  // Some ICU builds report midnight as hour "24" with hour12: false.
  let hour = parseInt(map.hour, 10)
  if (hour === 24) hour = 0

  return {
    dateKey: `${map.year}-${map.month}-${map.day}`,
    minutes: hour * 60 + parseInt(map.minute, 10),
    timestamp: now.getTime(),
  }
}

// Builds the canonical YYYY-MM-DD key from calendar-grid parts. `month` is
// 0-indexed, matching Date#getMonth()/#getFullYear() conventions used by the
// calendar UI.
export function toDateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, "0")
  const dd = String(day).padStart(2, "0")
  return `${year}-${mm}-${dd}`
}

export const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isValidDateKey(dateKey) {
  return typeof dateKey === "string" && DATE_KEY_PATTERN.test(dateKey)
}

export function isWeekendDateKey(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number)
  // Constructing with explicit numeric parts always resolves as local
  // wall-clock date -- no implicit UTC parsing, so this is safe regardless of
  // the machine's own timezone.
  const dayOfWeek = new Date(y, m - 1, d).getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

// True if `slotTime` (HH:mm, 24h) on `dateKey` (YYYY-MM-DD) is still bookable
// given `now` (defaults to the current moment in the business timezone):
// past dates/slots and anything inside the minimum-notice window are excluded.
export function isSlotBookable(dateKey, slotTime, now = getNowInTimeZone(BUSINESS_TIMEZONE)) {
  if (dateKey < now.dateKey) return false
  if (dateKey > now.dateKey) return true

  const [h, m] = slotTime.split(":").map(Number)
  const slotMinutes = h * 60 + m
  return slotMinutes >= now.minutes + MIN_BOOKING_NOTICE_MINUTES
}
