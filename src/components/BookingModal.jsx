import React, { useState, useEffect } from "react"

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: Date/Time selection, 2: Form, 3: Success
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [hpFieldX, setHpFieldX] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setStep(1)
      setSelectedDate(null)
      setSelectedTime(null)
      setName("")
      setEmail("")
      setMessage("")
      setHpFieldX("")
      setError("")
      setViewDate(new Date())
    }
    window.addEventListener("open-booking", handleOpen)
    return () => window.removeEventListener("open-booking", handleOpen)
  }, [])

  if (!isOpen) return null

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthName = viewDate.toLocaleString("default", { month: "long" })

  // Calendar math
  const firstDayIndex = new Date(year, month, 1).getDay() // 0 = Sunday, 1 = Monday, etc.
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1 // Start week on Monday
  const totalDays = new Date(year, month + 1, 0).getDate()

  const daysGrid = []
  for (let i = 0; i < adjustedFirstDay; i++) {
    daysGrid.push(null)
  }
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d)
  }

  // "Now" as seen in Asia/Kolkata, regardless of the visitor's local
  // timezone — this must match booking.php's server-side validation,
  // which also anchors everything to Asia/Kolkata. A visitor browsing
  // from a different timezone would otherwise see a different "today"
  // (and different past/future slots) than what the backend enforces.
  const istNow = (() => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date())

    const map = {}
    for (const p of parts) map[p.type] = p.value

    return {
      year: Number(map.year),
      month: Number(map.month), // 1-12
      day: Number(map.day),
      hour: Number(map.hour) % 24, // some engines report midnight as "24"
      minute: Number(map.minute),
    }
  })()
  const istTodayKey = istNow.year * 10000 + istNow.month * 100 + istNow.day

  const isDayAvailable = (day) => {
    if (!day) return false
    const cellKey = year * 10000 + (month + 1) * 100 + day
    return cellKey >= istTodayKey
  }

  const selectDateHandler = (day) => {
    if (!isDayAvailable(day)) return
    const dateObj = new Date(year, month, day)
    setSelectedDate(dateObj)
    setSelectedTime(null)
  }

  const timeSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM"
  ]

  // A slot is only "already past" when the selected date is today (IST) —
  // any other future date is always fully open.
  const isSlotPast = (timeStr) => {
    if (!selectedDate) return false
    const selKey = selectedDate.getFullYear() * 10000 + (selectedDate.getMonth() + 1) * 100 + selectedDate.getDate()
    if (selKey !== istTodayKey) return false

    const match = timeStr.match(/^(\d{2}):(\d{2}) (AM|PM)$/)
    if (!match) return false
    let hour = Number(match[1]) % 12
    if (match[3] === "PM") hour += 12
    const slotMinutes = hour * 60 + Number(match[2])
    const nowMinutes = istNow.hour * 60 + istNow.minute

    return slotMinutes <= nowMinutes
  }

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const prevMonth = () => {
    // Avoid going to past months
    const currentToday = new Date()
    if (year === currentToday.getFullYear() && month <= currentToday.getMonth()) return
    setViewDate(new Date(year, month - 1, 1))
  }

  // Local Y-M-D components, not .toISOString() (which converts to UTC and
  // can shift the date by a day depending on the visitor's timezone offset).
  const toIsoDate = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    if (!name || !email || !selectedDate || !selectedTime) {
      setError("Please fill out all required fields.")
      return
    }
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/booking.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          date: toIsoDate(selectedDate),
          time: selectedTime,
          message,
          hp_field_x: hpFieldX
        })
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStep(3)
      } else {
        setError(data.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("Failed to connect to the server.")
    } finally {
      setLoading(false)
    }
  }

  const closeBooking = () => {
    setIsOpen(false)
  }

  return (
    <div className="booking-overlay" onClick={closeBooking}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Left side / Top Info bar */}
        <div className="booking-info">
          <button className="booking-close-mobile" onClick={closeBooking} aria-label="Close">×</button>
          
          <div className="brand" style={{ marginBottom: "24px" }}>
            <span className="brand-mark" aria-hidden="true" style={{ color: "var(--brand-cyan)" }}>
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
                <path d="M4 7 12 3l8 4v10l-8 4-8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="brand-name" style={{ color: "var(--fg)" }}>Evoletrix</span>
          </div>

          <h3 className="booking-meet-title">Product Consultation</h3>
          <div className="booking-duration">30 Min Meeting</div>
          <p className="booking-desc">
            Let's discuss your product roadmap, software architecture requirements, and how Evoletrix can design and engineer your solution to scale.
          </p>

          {step === 2 && (
            <button className="booking-back-btn" onClick={() => setStep(1)}>
              ← Back to Calendar
            </button>
          )}
        </div>

        {/* Right side / Flow panels */}
        <div className="booking-flow">
          <button className="booking-close-desktop" onClick={closeBooking} aria-label="Close">×</button>

          {step === 1 && (
            <div className="booking-step1">
              <h4 className="booking-flow-title">Select Date &amp; Time</h4>
              
              <div className="booking-scheduler-grid">
                {/* Calendar Panel */}
                <div className="booking-calendar-wrapper">
                  <header className="calendar-header">
                    <span className="calendar-month-name">{monthName} {year}</span>
                    <div className="calendar-nav">
                      <button onClick={prevMonth} aria-label="Previous month" className="cal-nav-btn">‹</button>
                      <button onClick={nextMonth} aria-label="Next month" className="cal-nav-btn">›</button>
                    </div>
                  </header>

                  <div className="calendar-weekdays">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>

                  <div className="calendar-days-grid">
                    {daysGrid.map((day, idx) => {
                      const isAvailable = isDayAvailable(day)
                      const isSelected = selectedDate && 
                        selectedDate.getDate() === day && 
                        selectedDate.getMonth() === month && 
                        selectedDate.getFullYear() === year

                      return (
                        <button
                          key={idx}
                          disabled={!isAvailable}
                          onClick={() => selectDateHandler(day)}
                          className={`calendar-day-btn ${!day ? "empty" : ""} ${isAvailable ? "available" : ""} ${isSelected ? "selected" : ""}`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Slots Panel */}
                <div className="booking-time-wrapper">
                  {selectedDate ? (
                    <>
                      <span className="booking-selected-date-label">
                        {selectedDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <p className="booking-timezone-note">All times are in IST (UTC+5:30)</p>
                      <div className="booking-slots-list">
                        {timeSlots.map((time, idx) => {
                          const past = isSlotPast(time)
                          return (
                            <button
                              key={idx}
                              disabled={past}
                              onClick={() => setSelectedTime(time)}
                              className={`booking-slot-btn ${selectedTime === time ? "selected" : ""}`}
                            >
                              {time}
                            </button>
                          )
                        })}
                      </div>

                      {selectedTime && (
                        <button 
                          className="btn btn-solid btn-sm" 
                          style={{ marginTop: "16px", width: "100%" }}
                          onClick={() => setStep(2)}
                        >
                          Next →
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="booking-slots-placeholder">
                      Select a date to view available time slots.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="booking-step2">
              <h4 className="booking-flow-title">Enter Details</h4>
              <p className="booking-flow-meta">
                {selectedDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>

              <form onSubmit={handleConfirm} className="booking-form">
                <div className="form-group">
                  <label htmlFor="b-name">Your Name *</label>
                  <input
                    id="b-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="b-email">Your Email *</label>
                  <input
                    id="b-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="b-desc">Project Details / Message</label>
                  <textarea
                    id="b-desc"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    placeholder="Describe your goals, requirements, or tech stack..."
                    rows={3}
                  />
                </div>

                {/* Honeypot: invisible to real users, catches bots that fill every field. */}
                <input
                  type="text"
                  name="hp_field_x"
                  value={hpFieldX}
                  onChange={(e) => setHpFieldX(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
                />

                {error && <p className="booking-error-msg">{error}</p>}

                <button type="submit" disabled={loading} className="btn btn-solid" style={{ width: "100%", justifyContent: "center" }}>
                  {loading ? "Confirming..." : "Confirm Meeting →"}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="booking-step3">
              <div className="success-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="booking-flow-title">Request Received!</h4>
              <p className="booking-success-desc">
                We'll confirm your slot by email within 24 hours.
              </p>

              <div className="booking-summary-card">
                <h5>Product Consultation</h5>
                <p className="summary-row"><strong>Date:</strong> {selectedDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="summary-row"><strong>Time:</strong> {selectedTime}</p>
                <p className="summary-row"><strong>Type:</strong> 30 Min Video Call</p>
              </div>

              <button className="btn btn-solid" style={{ width: "100%", justifyContent: "center" }} onClick={closeBooking}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
