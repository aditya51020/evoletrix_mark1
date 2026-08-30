import express from "express"
import cors from "cors"

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

// Booking Calendar Endpoint
app.post("/api/booking", (req, res) => {
  const { name, email, date, time, message } = req.body
  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: "Name, email, date, and time are required" })
  }
  console.log(`Received booking: ${name} (${email}) on ${date} at ${time}`)
  return res.status(200).json({ message: "Booking confirmed successfully!" })
})

export default app
