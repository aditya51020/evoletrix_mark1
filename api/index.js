import express from "express"
import cors from "cors"
import { getAvailability, createBooking } from "./bookingStore.js"

const app = express()
app.use(cors())
app.use(express.json())

// Contact Form Endpoint
app.post("/api/contact", (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: "Email is required" })
  }
  console.log(`Received contact request from: ${email}`)
  return res.status(200).json({ message: "Thank you! We will get in touch soon." })
})

// Returns which of the configured meeting slots are still bookable for a
// given date -- past slots, slots inside the minimum-notice window, and
// already-booked slots are all excluded server-side.
app.get("/api/availability", (req, res) => {
  const { date } = req.query
  const result = getAvailability(date)
  if (result.error) {
    return res.status(400).json({ error: "A valid date (YYYY-MM-DD) is required." })
  }
  return res.status(200).json({ date, slots: result.slots })
})

// Booking Calendar Endpoint. Availability is re-checked here regardless of
// what the client showed, so a stale or tampered-with client request can
// never create a double-booking or a booking inside the notice window.
app.post("/api/booking", async (req, res) => {
  const { name, email, date, time, message } = req.body
  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: "Name, email, date, and time are required" })
  }

  try {
    const result = await createBooking({ name, email, date, time, message })

    if (result.error === "SLOT_TAKEN") {
      return res.status(409).json({ error: "This slot is no longer available. Please choose another time." })
    }
    if (result.error === "SLOT_EXPIRED") {
      return res.status(409).json({ error: "This time slot is no longer available for booking. Please choose a later slot." })
    }
    if (result.error === "INVALID_DATE" || result.error === "INVALID_SLOT") {
      return res.status(400).json({ error: "The selected date or time is not valid." })
    }

    console.log(`Received booking: ${result.booking.name} (${result.booking.email}) on ${result.booking.date} at ${result.booking.time}`)
    return res.status(201).json({ message: "Booking confirmed successfully!", booking: result.booking })
  } catch (err) {
    console.error("Booking failed:", err)
    return res.status(500).json({ error: "Something went wrong. Please try again." })
  }
})

export default app
