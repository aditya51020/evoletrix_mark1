import fs from "fs"
import path from "path"
import os from "os"
import { fileURLToPath } from "url"
import {
  BUSINESS_TIMEZONE,
  TIME_SLOTS,
  getNowInTimeZone,
  isValidDateKey,
  isWeekendDateKey,
  isSlotBookable,
} from "../src/lib/bookingConfig.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Serverless platforms (Vercel included) ship a read-only filesystem outside
// of /tmp, so bookings are persisted there when running in that environment
// and to a real project-local folder for the self-hosted server.js process
// (where it survives restarts). Either way this is a stand-in for a real
// database -- see the note in server.js/api/index.js for the production caveat.
const dataDir = process.env.VERCEL ? os.tmpdir() : path.join(__dirname, "..", "data")
const BOOKINGS_FILE = path.join(dataDir, "bookings.json")
const LOCK_FILE = path.join(dataDir, "bookings.lock")
const LOCK_STALE_MS = 5000
const LOCK_RETRY_MS = 20
const LOCK_MAX_RETRIES = 100

function ensureDataDir() {
  fs.mkdirSync(dataDir, { recursive: true })
}

function readBookings() {
  try {
    const raw = fs.readFileSync(BOOKINGS_FILE, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    if (err.code === "ENOENT") return []
    console.error("Failed to read bookings store, treating as empty:", err)
    return []
  }
}

function writeBookings(bookings) {
  ensureDataDir()
  // Write to a temp file then rename: readers never observe a half-written file.
  const tmpFile = `${BOOKINGS_FILE}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(tmpFile, JSON.stringify(bookings, null, 2))
  fs.renameSync(tmpFile, BOOKINGS_FILE)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// A filesystem-based mutex so that two near-simultaneous booking requests --
// even across separate Node processes on the same machine -- serialize
// through the same read-check-write critical section instead of racing.
async function acquireLock() {
  ensureDataDir()
  for (let attempt = 0; attempt < LOCK_MAX_RETRIES; attempt++) {
    try {
      const fd = fs.openSync(LOCK_FILE, "wx")
      fs.closeSync(fd)
      return
    } catch (err) {
      if (err.code !== "EEXIST") throw err
      try {
        const stat = fs.statSync(LOCK_FILE)
        if (Date.now() - stat.mtimeMs > LOCK_STALE_MS) {
          fs.unlinkSync(LOCK_FILE) // previous holder crashed; self-heal
          continue
        }
      } catch {
        // Lock disappeared between the failed open and this check -- retry immediately.
        continue
      }
      await sleep(LOCK_RETRY_MS)
    }
  }
  throw new Error("Could not acquire booking lock; please try again.")
}

function releaseLock() {
  try {
    fs.unlinkSync(LOCK_FILE)
  } catch {
    // Already gone -- nothing to do.
  }
}

async function withBookingLock(fn) {
  await acquireLock()
  try {
    return await fn()
  } finally {
    releaseLock()
  }
}

// Slots for a given date, each flagged with whether it can still be booked
// right now (not in the past, respects the minimum-notice window, and not
// already taken). Computed fresh on every call against the current time and
// the current contents of the booking store -- nothing here is cached.
export function getAvailability(dateKey) {
  if (!isValidDateKey(dateKey)) {
    return { error: "INVALID_DATE" }
  }

  const now = getNowInTimeZone(BUSINESS_TIMEZONE)
  const isWeekend = isWeekendDateKey(dateKey)
  const bookedTimes = new Set(
    readBookings()
      .filter((b) => b.date === dateKey)
      .map((b) => b.time)
  )

  const slots = TIME_SLOTS.map((slot) => ({
    time: slot.time,
    label: slot.label,
    available: !isWeekend && isSlotBookable(dateKey, slot.time, now) && !bookedTimes.has(slot.time),
  }))

  return { slots }
}

// Re-validates and persists a booking under the lock, so the
// check-then-write is atomic: if two requests race for the same slot, only
// the first to acquire the lock sees it as free.
export async function createBooking({ name, email, date, time, message }) {
  if (!isValidDateKey(date)) return { error: "INVALID_DATE" }
  if (!TIME_SLOTS.some((slot) => slot.time === time)) return { error: "INVALID_SLOT" }
  if (isWeekendDateKey(date)) return { error: "INVALID_SLOT" }

  return withBookingLock(async () => {
    const now = getNowInTimeZone(BUSINESS_TIMEZONE)
    if (!isSlotBookable(date, time, now)) {
      return { error: "SLOT_EXPIRED" }
    }

    const bookings = readBookings()
    if (bookings.some((b) => b.date === date && b.time === time)) {
      return { error: "SLOT_TAKEN" }
    }

    const booking = {
      id: `${date}_${time}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      date,
      time,
      message: message || "",
      createdAt: new Date().toISOString(),
    }

    bookings.push(booking)
    writeBookings(bookings)
    return { booking }
  })
}
