import React, { useState } from "react"

export default function CTASection() {
  const [email, setEmail] = useState("")
  const [hpFieldX, setHpFieldX] = useState("")
  const [status, setStatus] = useState("") // "", "loading", "success", "error"
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, hp_field_x: hpFieldX }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
        setErrorMsg(data.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setStatus("error")
      setErrorMsg("Failed to connect to the server. Please try again.")
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
                {errorMsg}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
