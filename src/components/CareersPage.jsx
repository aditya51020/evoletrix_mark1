import React, { useState, useEffect } from "react"

export default function CareersPage() {
  const [gradNum, setGradNum] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFunc, setActiveFunc] = useState("All")
  const [activeLoc, setActiveLoc] = useState("All")
  const [activeExp, setActiveExp] = useState("All")

  // Accordion state for sidebar filters
  const [openFilters, setOpenFilters] = useState({
    function: true,
    location: true,
    experience: true
  })

  // Cycle banner background gradient (5, 6, 7) every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGradNum((prev) => (prev === 7 ? 5 : prev + 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const toggleFilter = (key) => {
    setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const jobs = [
    { title: "AI/ML Engineer", location: "Noida", department: "Engineering", experience: "Senior (5+ yrs)" },
    { title: "Tech Lead Node.js", location: "Noida", department: "Engineering", experience: "Senior (5+ yrs)" },
    { title: "Social Media Executive", location: "Noida", department: "Marketing", experience: "Junior (1-3 yrs)" },
    { title: "Full Stack Developer", location: "Faridabad", department: "Engineering", experience: "Mid-level (3-5 yrs)" },
    { title: "Senior UI/UX Designer", location: "Noida", department: "Design", experience: "Senior (5+ yrs)" },
    { title: "DevOps Architect", location: "Noida", department: "Engineering", experience: "Senior (5+ yrs)" },
    { title: "GIS Specialist", location: "Faridabad", department: "Engineering", experience: "Mid-level (3-5 yrs)" },
    { title: "Product Manager", location: "Remote", department: "Product Management", experience: "Senior (5+ yrs)" }
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFunc = activeFunc === "All" || job.department === activeFunc
    const matchesLoc = activeLoc === "All" || job.location === activeLoc
    const matchesExp = activeExp === "All" || job.experience === activeExp
    return matchesSearch && matchesFunc && matchesLoc && matchesExp
  })

  return (
    <>
      {/* SECTION 1: Banner with dynamic gradient */}
      <section className="section about-page-section" aria-labelledby="careersTitle" style={{ paddingBlock: "96px 64px" }}>
        <div className="shell">
          <header className="ind-page-header" style={{ marginBottom: "56px" }}>
            <h1 id="careersTitle" className="display" style={{ marginBottom: "16px" }}>
              Join the Squad Shaping Tomorrow
            </h1>
            <p className="ind-page-sub">Careers at Evoletrix</p>
          </header>

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
                ? LIFE AT EVOLETRIX
              </span>
              <h2 style={{ color: "#ffffff", fontSize: "28px", fontWeight: "600", marginTop: "8px" }}>
                Building Digital Masterpieces from Faridabad
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Why Work with Evoletrix? */}
      <section className="section about-powerhouse" style={{ paddingBlock: "64px 96px" }}>
        <div className="shell">
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 56px" }}>
            <h2 className="display" style={{ fontSize: "36px", fontWeight: "700", color: "var(--fg)" }}>
              Why Work with Evoletrix?
            </h2>
            <p style={{ color: "var(--fg-muted)", fontSize: "15px", lineHeight: "1.7", marginTop: "20px" }}>
              At Evoletrix, we provide an ecosystem where top engineering talent owns codebases, integrates cutting-edge tech, and grows with direct client delivery.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }} className="stats-grid-about">
            <div style={{ background: "#ffffff", border: "1px solid rgba(0, 0, 0, 0.08)", padding: "36px 28px", borderRadius: "var(--radius-sm)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#18181b", marginBottom: "12px" }}>Accelerated Growth</h3>
              <p style={{ color: "#44444a", fontSize: "13.5px", lineHeight: "1.65" }}>
                Own your code, drive architectures, and take absolute product ownership from discovery to deployment.
              </p>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid rgba(0, 0, 0, 0.08)", padding: "36px 28px", borderRadius: "var(--radius-sm)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#18181b", marginBottom: "12px" }}>Modern Stack & Innovation</h3>
              <p style={{ color: "#44444a", fontSize: "13.5px", lineHeight: "1.65" }}>
                Work with cutting-edge AI agents, Generative AI models, high-accuracy GIS georeferencing, and scalable cloud systems.
              </p>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid rgba(0, 0, 0, 0.08)", padding: "36px 28px", borderRadius: "var(--radius-sm)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#18181b", marginBottom: "12px" }}>Engineering Culture</h3>
              <p style={{ color: "#44444a", fontSize: "13.5px", lineHeight: "1.65" }}>
                Enjoy a close-knit engineering culture locally in Faridabad with transparent, asynchronous Slack execution.
              </p>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid rgba(0, 0, 0, 0.08)", padding: "36px 28px", borderRadius: "var(--radius-sm)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#18181b", marginBottom: "12px" }}>Inclusive Environment</h3>
              <p style={{ color: "#44444a", fontSize: "13.5px", lineHeight: "1.65" }}>
                We promise you an inclusive work environment where you will fall in love with challenging as well as getting challenged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer transition: Dark to Light (Black to White) */}
      <div className="bg-transition-spacer" aria-hidden="true"></div>

      {/* SECTION 3: Trending Opportunities (Appinventiv Style filter layout) */}
      <section className="section outcomes theme-light-block" style={{ paddingBlock: "96px" }}>
        <div className="shell">
          <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: "48px" }} className="app-test-container">
            
            {/* Left Column: Filter Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#2f6bff", marginBottom: "8px" }}>
                Filter by
              </h3>
              
              {/* Function Filter Accordion */}
              <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "16px" }}>
                <button 
                  onClick={() => toggleFilter("function")}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#18181b" }}>Function</span>
                  <span style={{ transform: openFilters.function ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>?</span>
                </button>
                {openFilters.function && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                    {["All", "Engineering", "Design", "Marketing", "Product Management"].map((func) => (
                      <label key={func} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                        <input 
                          type="radio" 
                          name="function"
                          checked={activeFunc === func} 
                          onChange={() => setActiveFunc(func)}
                          style={{ accentColor: "#2f6bff" }}
                        />
                        {func}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Filter Accordion */}
              <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "16px" }}>
                <button 
                  onClick={() => toggleFilter("location")}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#18181b" }}>Location</span>
                  <span style={{ transform: openFilters.location ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>?</span>
                </button>
                {openFilters.location && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                    {["All", "Noida", "Faridabad", "Remote"].map((loc) => (
                      <label key={loc} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                        <input 
                          type="radio" 
                          name="location"
                          checked={activeLoc === loc} 
                          onChange={() => setActiveLoc(loc)}
                          style={{ accentColor: "#2f6bff" }}
                        />
                        {loc}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience Filter Accordion */}
              <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "16px" }}>
                <button 
                  onClick={() => toggleFilter("experience")}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#18181b" }}>Experience</span>
                  <span style={{ transform: openFilters.experience ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>?</span>
                </button>
                {openFilters.experience && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                    {["All", "Junior (1-3 yrs)", "Mid-level (3-5 yrs)", "Senior (5+ yrs)"].map((exp) => (
                      <label key={exp} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                        <input 
                          type="radio" 
                          name="experience"
                          checked={activeExp === exp} 
                          onChange={() => setActiveExp(exp)}
                          style={{ accentColor: "#2f6bff" }}
                        />
                        {exp}
                      </label>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Trending Opportunities & Search list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div>
                <h2 className="display" style={{ color: "var(--light-fg)", fontSize: "36px", fontWeight: "700", marginBottom: "8px" }}>
                  Trending Opportunities
                </h2>
                <p style={{ color: "#71717a", fontSize: "14.5px", lineHeight: "1.6" }}>
                  We promise you an inclusive work environment where you will fall in love with challenging as well as getting challenged.
                </p>
              </div>

              {/* Find your role search bar */}
              <div style={{ position: "relative" }}>
                <input 
                  type="text" 
                  placeholder="Find your role"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "16px 48px 16px 20px", 
                    borderRadius: "var(--radius-sm)", 
                    border: "1px solid #e4e4e7", 
                    background: "#ffffff", 
                    fontSize: "14.5px",
                    color: "#18181b"
                  }}
                />
                <span style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", color: "#a1a1aa" }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
              </div>

              {/* Positions indicator */}
              <div style={{ color: "#71717a", fontSize: "13px", fontWeight: "600" }}>
                Showing {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"}
              </div>

              {/* Jobs List */}
              <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e4e4e7" }}>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, idx) => (
                    <div 
                      key={idx}
                      onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        padding: "24px 20px", 
                        borderBottom: "1px solid #e4e4e7",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      className="job-row-item"
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "700", color: "#18181b" }}>{job.title}</span>
                        <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#71717a" }}>{job.department} · {job.experience}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <span style={{ fontSize: "14px", color: "#18181b", fontWeight: "500" }}>{job.location}</span>
                        <span style={{ fontSize: "18px", color: "#18181b" }}>?</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#71717a", fontSize: "14.5px" }}>
                    No matching positions found. Try adjusting your filters or search query!
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Spacer transition: Light to Dark (White to Black) */}
      <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>
    </>
  )
}
