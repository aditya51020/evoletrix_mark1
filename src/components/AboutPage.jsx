import React, { useState, useEffect, useRef } from "react"
import FAQSection from "./FAQSection"

function StatItem({ count, suffix, decimals = 0, label, description }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let active = true
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && active) {
        let start = 0
        const end = parseFloat(count)
        const duration = 1200 // ms
        const startTime = performance.now()

        const animate = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const ease = progress * (2 - progress) // ease out
          const value = start + (end - start) * ease
          
          setCurrent(value)

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            setCurrent(end)
          }
        }
        requestAnimationFrame(animate)
        observer.disconnect()
      }
    }, { threshold: 0.1 })

    if (ref.current) observer.observe(ref.current)

    return () => {
      active = false
      observer.disconnect()
    }
  }, [count])

  return (
    <div className="stat reveal" ref={ref} style={{ border: "1px solid rgba(0, 0, 0, 0.08)", background: "#ffffff", padding: "28px 20px", borderRadius: "var(--radius-sm)", textAlign: "center", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)" }}>
      <span className="stat-num" style={{ color: "#18181b", background: "none", WebkitBackgroundClip: "initial", backgroundClip: "initial", fontSize: "36px", fontWeight: "700", display: "block" }}>
        {current.toFixed(decimals)}
        {suffix}
      </span>
      <span className="stat-label" style={{ fontWeight: "700", color: "#27272a", fontSize: "13.5px", display: "block", marginTop: "8px" }}>{label}</span>
      {description && (
        <span style={{ fontSize: "11.5px", color: "#71717a", display: "block", marginTop: "4px" }}>
          {description}
        </span>
      )}
    </div>
  )
}

export default function AboutPage() {
  const [gradNum, setGradNum] = useState(5)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [activeTab, setActiveTab] = useState("clients")

  // Cycle collaboration gradients (5, 6, 7) every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGradNum((prev) => (prev === 7 ? 5 : prev + 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Neeraj Tiwari",
      role: "Director - Digital Engineering",
      company: "Americana Group (Kuwait Food Co.)",
      text: "We approached Evoletrix with a clear vision to build a robust and future-ready platform that could seamlessly integrate with the busy lifestyle of our customers while uplifting their overall experience and giving us a competitive edge.",
      logo: "AMERICANA",
      avatarGrad: "linear-gradient(135deg, #7c3aed, #2f6bff)",
      visualGrad: "linear-gradient(135deg, #7c3aed, #2563eb 55%, #22d3ee)"
    },
    {
      name: "Sarah Jenkins",
      role: "CTO",
      company: "HealthSync Labs",
      text: "Evoletrix engineered our HIPAA-compliant diagnostic platform with absolute precision. Their squad integrated directly into our Slack, working with transparency and speed.",
      logo: "HEALTHSYNC",
      avatarGrad: "linear-gradient(135deg, #22d3ee, #86efac)",
      visualGrad: "linear-gradient(135deg, #22d3ee, #2563eb 60%, #a855f7)"
    }
  ]

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  return (
    <>
      {/* SECTION 1: Dark Story (OUR WORKPLACE Banner) */}
      <section className="section about-page-section" aria-labelledby="aboutTitle" style={{ paddingBlock: "96px 64px" }}>
        <div className="shell">
          <header className="ind-page-header" style={{ marginBottom: "56px" }}>
            <h1 id="aboutTitle" className="display" style={{ marginBottom: "16px" }}>
              50+ Minds. 120+ Digital Masterpieces. One Vision.
            </h1>
            <p className="ind-page-sub">The Evoletrix Story</p>
          </header>

          {/* Large workplace banner cycling gradients 5, 6, 7 every 2s */}
          <div 
            data-grad={gradNum}
            style={{ 
              height: "360px",
              border: "1px solid var(--line-soft)",
              borderRadius: "var(--radius)",
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              padding: "40px",
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.4)",
              overflow: "hidden",
              transition: "background 0.8s ease-in-out, background-image 0.8s ease-in-out"
            }}
            className="about-hero-banner"
          >
            {/* Soft grid drift overlays */}
            <div 
              style={{ 
                position: "absolute", 
                inset: 0, 
                opacity: 0.08, 
                backgroundImage: "radial-gradient(var(--fg) 1px, transparent 1px)", 
                backgroundSize: "20px 20px" 
              }}
            ></div>
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="pill-tag" style={{ color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.2)", marginBottom: "12px" }}>
                ◼ OUR WORKPLACE
              </span>
              <h2 style={{ color: "#ffffff", fontSize: "28px", fontWeight: "600", marginTop: "8px" }}>
                Engineering the Future from Faridabad
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Powerhouse stats grid */}
      <section className="section about-powerhouse" style={{ paddingBlock: "64px 96px" }}>
        <div className="shell">
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 56px" }}>
            <h2 className="display" style={{ fontSize: "24px", lineHeight: "1.5", fontWeight: "600", color: "var(--fg)" }}>
              We are a digital engineering powerhouse trusted by enterprises to transform their boldest visions into market-leading realities.
            </h2>
            <p style={{ color: "var(--fg-muted)", fontSize: "15px", lineHeight: "1.7", marginTop: "20px" }}>
              Armed with top-tier engineering talent, deep GIS/AI expertise, and battle-tested frameworks, we don't just build solutions—we architect competitive advantages that scale.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="stats-grid-about">
            <StatItem count={35} suffix="+" label="Industries Mastered" description="Domain sector coverage." />
            <StatItem count={15} suffix="+" label="Global Recognitions" description="Engineering excellence awards." />
            <StatItem count={70} suffix="+" label="Countries Powered" description="By our custom solutions." />
            <StatItem count={5} suffix="+" label="Excellence Centers" description="Delivering core innovations." />
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
              className="btn btn-solid"
              style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}
            >
              Consult Our Experts →
            </button>
          </div>
        </div>
      </section>

      {/* Spacer transition: Dark to Light (Black to White) */}
      <div className="bg-transition-spacer" aria-hidden="true"></div>

      {/* SECTION 3: Logo Showcase of Transformed Leaders */}
      <section className="section outcomes theme-light-block" style={{ paddingBlock: "96px 48px" }}>
        <div className="shell">
          <header className="ind-page-header" style={{ marginBottom: "56px" }}>
            <h2 className="display" style={{ color: "var(--light-fg)", fontSize: "36px", fontWeight: "700" }}>
              Our Efforts Have Transformed How You Experience These Global Leaders
            </h2>
          </header>

          {/* 3 rows of leader logos */}
          <div className="logo-strip" style={{ marginTop: "0", display: "grid", gap: "28px" }}>
            <ul style={{ gap: "48px" }}>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>IKEA</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>GOOGLE</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>BCG</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>KFC</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>TGI FRIDAYS</li>
            </ul>
            <ul style={{ gap: "48px" }}>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>MOO</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>KRISPY KREME</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>HARDEES</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>VIRGIN MOBILE</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>DOMINO'S</li>
            </ul>
            <ul style={{ gap: "48px" }}>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>SUPERSHE</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>WIMPY</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>EMPIRE HOTELS</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>JOBGET</li>
              <li style={{ color: "#18181b", fontWeight: "700", opacity: 0.6 }}>ASIAN BANK</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Client Testimonials (below brand section) */}
      <section className="section outcomes theme-light-block" style={{ paddingBlock: "48px 96px", borderTop: "1px solid var(--light-line)" }}>
        <div className="shell">
          <header style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 className="display" style={{ color: "var(--light-fg)", fontSize: "36px", fontWeight: "700" }}>
              Here Are a Few Thoughts Shared by
            </h2>
            
            {/* Sub-selectors tab row */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px" }}>
              <button 
                onClick={() => setActiveTab("clients")}
                className="btn btn-sm"
                style={{ 
                  borderRadius: "20px", 
                  padding: "8px 20px", 
                  background: activeTab === "clients" ? "#18181b" : "transparent",
                  color: activeTab === "clients" ? "#ffffff" : "#71717a",
                  border: "1px solid #18181b"
                }}
              >
                Our Clients
              </button>
              <button 
                onClick={() => setActiveTab("employees")}
                className="btn btn-sm"
                style={{ 
                  borderRadius: "20px", 
                  padding: "8px 20px", 
                  background: activeTab === "employees" ? "#18181b" : "transparent",
                  color: activeTab === "employees" ? "#ffffff" : "#71717a",
                  border: "1px solid #e4e4e7"
                }}
              >
                Our Employees
              </button>
            </div>
          </header>

          {activeTab === "clients" ? (
            /* Testimonial block layout with aligned heights and gradient imagery */
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }} className="app-test-container">
              
              {/* Left Column Content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Aligned Header Row with equal heights */}
                <div style={{ display: "flex", gap: "16px", alignItems: "stretch", width: "100%" }}>
                  
                  {/* Profile Gradient visual instead of photo icon */}
                  <div 
                    style={{ 
                      width: "80px", 
                      background: testimonials[activeTestimonial].avatarGrad, 
                      borderRadius: "var(--radius-sm)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      overflow: "hidden" 
                    }}
                  >
                    <span style={{ color: "#ffffff", fontWeight: "700", fontSize: "20px", fontFamily: "var(--font-mono)" }}>
                      {testimonials[activeTestimonial].name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  
                  {/* Name and title box */}
                  <div style={{ background: "var(--light-panel)", border: "1px solid var(--light-line)", borderRadius: "var(--radius-sm)", padding: "14px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h4 style={{ margin: 0, fontSize: "16px", color: "var(--light-fg)", fontWeight: "700" }}>{testimonials[activeTestimonial].name}</h4>
                    <span style={{ fontSize: "11px", color: "var(--fg-dim)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                      {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                    </span>
                  </div>

                  {/* Company Logo box */}
                  <div style={{ background: "var(--light-panel)", border: "1px solid var(--light-line)", borderRadius: "var(--radius-sm)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "140px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", fontFamily: "var(--font-mono)", color: "#18181b", letterSpacing: "0.08em" }}>
                      {testimonials[activeTestimonial].company.split(" ")[0].toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Big testimonial description text card */}
                <div style={{ background: "var(--light-panel)", border: "1px solid var(--light-line)", borderRadius: "var(--radius-sm)", padding: "36px", position: "relative" }}>
                  <span style={{ fontSize: "60px", color: "var(--brand)", position: "absolute", top: "10px", left: "20px", fontFamily: "Georgia, serif", lineHeight: 1, opacity: 0.15 }}>“</span>
                  <p style={{ fontSize: "15px", lineHeight: "1.75", color: "#27272a", position: "relative", zIndex: 2, paddingLeft: "12px" }}>
                    {testimonials[activeTestimonial].text}
                  </p>
                  
                  {/* Slider controls bottom right */}
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "24px" }}>
                    <button 
                      onClick={prevTestimonial}
                      style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--light-line)", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer", color: "#18181b" }}
                      aria-label="Previous testimonial"
                    >
                      ←
                    </button>
                    <button 
                      onClick={nextTestimonial}
                      style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--light-line)", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer", color: "#18181b" }}
                      aria-label="Next testimonial"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column Abstract Gradient Visual */}
              <div 
                style={{ 
                  background: testimonials[activeTestimonial].visualGrad, 
                  borderRadius: "var(--radius)",
                  height: "100%",
                  minHeight: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "background 0.5s ease"
                }}
              >
                <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
              </div>

            </div>
          ) : (
            /* Employee Testimonials view */
            <div style={{ background: "var(--light-panel)", border: "1px solid var(--light-line)", borderRadius: "var(--radius-sm)", padding: "36px", textAlign: "center" }}>
              <p style={{ fontSize: "15px", lineHeight: "1.75", color: "#27272a", fontStyle: "italic" }}>
                "Working at Evoletrix has allowed me to engineer high-performance systems and own the developer lifecycle. The squad fosters transparency, speed, and continuous learning."
              </p>
              <strong style={{ display: "block", fontSize: "13px", color: "var(--light-fg)", marginTop: "16px" }}>Anirudh Sharma</strong>
              <span style={{ fontSize: "11px", color: "var(--fg-dim)", fontFamily: "var(--font-mono)" }}>Senior Backend Developer</span>
            </div>
          )}
        </div>
      </section>

      {/* FAQ SECTION (Directly following testimonials light block) */}
      <FAQSection />

      {/* Spacer transition: Light to Dark (White to Black) - Placed below FAQ */}
      <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>
    </>
  )
}
