import React, { useState } from "react"

export default function CTASection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("") // "", "loading", "success", "error"

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch (err) {
      setStatus("error")
    }
  }

  return (
    <section className="section final-cta theme-light-block" id="contact" aria-labelledby="ctaTitle">
      <div className="shell final-cta-inner">
        <h2 id="ctaTitle" className="display display--dark reveal">Ready to build something extraordinary?</h2>
        
        {status === "success" ? (
          <div className="reveal" style={{ marginTop: "24px", color: "var(--light-fg)", fontSize: "18px", fontWeight: "500" }}>
            Thank you! We will get in touch shortly for a coffee chat.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reveal" style={{ width: "100%", maxWidth: "480px", margin: "24px auto 0" }}>
            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <input
                type="email"
                required
                placeholder="Enter your business email…"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                style={{
                  padding: "14px 18px",
                  borderRadius: "8px",
                  border: "1px solid var(--light-line)",
                  backgroundColor: "var(--light-panel)",
                  color: "var(--light-fg)",
                  fontSize: "15px",
                  outline: "none"
                }}
              />
              <button 
                type="submit" 
                className="btn btn-dark btn-lg" 
                disabled={status === "loading"}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {status === "loading" ? "Scheduling..." : "Let's connect over coffee →"}
              </button>
            </div>
            {status === "error" && (
              <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>
                Something went wrong. Please try again or email info@evoletrix.com.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
