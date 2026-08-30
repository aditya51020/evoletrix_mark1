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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDayAvailable = (day) => {
    if (!day) return false
    const dateObj = new Date(year, month, day)
    dateObj.setHours(0, 0, 0, 0)

    if (dateObj < today) return false

    const dayOfWeek = dateObj.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 // Saturday or Sunday
    return !isWeekend
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

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const prevMonth = () => {
    // Avoid going to past months
    const currentToday = new Date()
    if (year === currentToday.getFullYear() && month <= currentToday.getMonth()) return
    setViewDate(new Date(year, month - 1, 1))
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
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          date: selectedDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: selectedTime,
          message
        })
      })

      if (res.ok) {
        setStep(3)
      } else {
        const errData = await res.json()
        setError(errData.error || "Something went wrong. Please try again.")
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
          <div className="booking-duration">
            <span style={{ fontSize: "14px", marginRight: "4px" }}>◷</span> 30 Min Meeting
          </div>
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
                      <div className="booking-slots-list">
                        {timeSlots.map((time, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTime(time)}
                            className={`booking-slot-btn ${selectedTime === time ? "selected" : ""}`}
                          >
                            {time}
                          </button>
                        ))}
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
                📅 {selectedDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
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

                {error && <p className="booking-error-msg">{error}</p>}

                <button type="submit" disabled={loading} className="btn btn-solid" style={{ width: "100%", justifyContent: "center" }}>
                  {loading ? "Confirming..." : "Confirm Meeting →"}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="booking-step3">
              <div className="success-icon" aria-hidden="true">✓</div>
              <h4 className="booking-flow-title">Meeting Confirmed!</h4>
              <p className="booking-success-desc">
                Your consultation session with Evoletrix has been scheduled.
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
