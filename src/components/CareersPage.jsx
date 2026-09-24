import React, { useState, useEffect } from "react"

export default function CareersPage() {
  const [gradNum, setGradNum] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFunc, setActiveFunc] = useState("All")
  const [activeLoc, setActiveLoc] = useState("All")
  const [activeExp, setActiveExp] = useState("All")
  const [activeMode, setActiveMode] = useState("All")
  const [selectedJob, setSelectedJob] = useState(null)

  const [applyMode, setApplyMode] = useState(false)
  const [applyName, setApplyName] = useState("")
  const [applyEmail, setApplyEmail] = useState("")
  const [applyPhone, setApplyPhone] = useState("")
  const [applyCoverNote, setApplyCoverNote] = useState("")
  const [applyResume, setApplyResume] = useState(null)
  const [applyHp, setApplyHp] = useState("")
  const [applyStatus, setApplyStatus] = useState("") // "", "loading", "success", "error"
  const [applyError, setApplyError] = useState("")

  const openJobModal = (job) => {
    setSelectedJob(job)
    setApplyMode(false)
    setApplyName("")
    setApplyEmail("")
    setApplyPhone("")
    setApplyCoverNote("")
    setApplyResume(null)
    setApplyHp("")
    setApplyStatus("")
    setApplyError("")
  }

  const closeJobModal = () => {
    setSelectedJob(null)
    setApplyMode(false)
  }

  const MAX_RESUME_BYTES = 5 * 1024 * 1024

  const handleResumeChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    if (file && file.size > MAX_RESUME_BYTES) {
      setApplyError("Resume file is too large (max 5 MB).")
      e.target.value = ""
      setApplyResume(null)
      return
    }
    setApplyError("")
    setApplyResume(file)
  }

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    if (!applyResume) {
      setApplyError("Please attach your resume (PDF).")
      return
    }
    setApplyStatus("loading")
    setApplyError("")

    const formData = new FormData()
    formData.append("job_id", selectedJob.id)
    formData.append("name", applyName)
    formData.append("email", applyEmail)
    formData.append("phone", applyPhone)
    formData.append("cover_note", applyCoverNote)
    formData.append("resume", applyResume)
    formData.append("hp_field_x", applyHp)

    try {
      // No Content-Type header here on purpose — the browser sets the
      // multipart boundary itself; setting it manually breaks the upload.
      const res = await fetch("/api/apply.php", {
        method: "POST",
        body: formData,
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setApplyStatus("success")
      } else {
        setApplyStatus("error")
        setApplyError(data.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setApplyStatus("error")
      setApplyError("Failed to connect to the server. Please try again.")
    }
  }

  const [jobs, setJobs] = useState([])
  const [jobsStatus, setJobsStatus] = useState("loading") // "loading" | "ready" | "error"
  const [jobsError, setJobsError] = useState("")

  const loadJobs = () => {
    setJobsStatus("loading")
    setJobsError("")
    fetch("/api/jobs.php")
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (!res.ok || !Array.isArray(data)) {
          throw new Error((data && data.error) || "Failed to load open positions.")
        }
        setJobs(data)
        setJobsStatus("ready")
      })
      .catch((err) => {
        setJobsError(err.message || "Failed to load open positions.")
        setJobsStatus("error")
      })
  }

  useEffect(() => {
    loadJobs()
  }, [])

  // Accordion state for sidebar filters (closed by default on load)
  const [openFilters, setOpenFilters] = useState({
    function: false,
    location: false,
    experience: false,
    workMode: false
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

  // Inline SVG Chevron helper to prevent unicode encoding issues
  const getChevron = (isOpen) => (
    <svg 
      viewBox="0 0 24 24" 
      width="14" 
      height="14" 
      fill="none" 
      stroke="#18181b" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )

  // Inline SVG Arrow helper for clean layout action arrows
  const getArrow = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )

  // Inline SVG Close helper
  const getCloseIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFunc = activeFunc === "All" || job.department === activeFunc
    const matchesLoc = activeLoc === "All" || job.location === activeLoc
    const matchesExp = activeExp === "All" || job.experience === activeExp
    const matchesMode = activeMode === "All" || job.workMode === activeMode
    return matchesSearch && matchesFunc && matchesLoc && matchesExp && matchesMode
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
              <span className="pill-tag" style={{ color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.2)", marginBottom: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <svg viewBox="0 0 24 24" width="6" height="6" fill="currentColor"><rect width="24" height="24"/></svg> LIFE AT EVOLETRIX
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
            
            {/* Left Column: STICKY Filter Sidebar */}
            <div>
              <div style={{ position: "sticky", top: "120px", alignSelf: "start", display: "flex", flexDirection: "column", gap: "24px" }}>
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
                    {getChevron(openFilters.function)}
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
                    {getChevron(openFilters.location)}
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

                {/* Work Mode Filter Accordion - NEW */}
                <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "16px" }}>
                  <button 
                    onClick={() => toggleFilter("workMode")}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#18181b" }}>Work Mode</span>
                    {getChevron(openFilters.workMode)}
                  </button>
                  {openFilters.workMode && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                      {["All", "On-site", "Hybrid", "Remote"].map((mode) => (
                        <label key={mode} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                          <input 
                            type="radio" 
                            name="workMode"
                            checked={activeMode === mode} 
                            onChange={() => setActiveMode(mode)}
                            style={{ accentColor: "#2f6bff" }}
                          />
                          {mode}
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
                    {getChevron(openFilters.experience)}
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
              {jobsStatus === "ready" && (
                <div style={{ color: "#71717a", fontSize: "13px", fontWeight: "600" }}>
                  Showing {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"}
                </div>
              )}

              {/* Jobs List */}
              <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e4e4e7" }}>
                {jobsStatus === "loading" && (
                  <div style={{ padding: "64px 20px", textAlign: "center", color: "#71717a", fontSize: "14px" }}>
                    Loading open positions…
                  </div>
                )}

                {jobsStatus === "error" && (
                  <div style={{ padding: "64px 20px", textAlign: "center", color: "#71717a", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={{ fontSize: "15px", fontWeight: "600", color: "#18181b" }}>Couldn't load open positions</span>
                    <span style={{ fontSize: "13px", color: "#71717a", maxWidth: "340px", lineHeight: "1.5" }}>{jobsError}</span>
                    <button onClick={loadJobs} className="btn btn-dark" style={{ padding: "10px 20px", fontSize: "13px" }}>Retry</button>
                  </div>
                )}

                {jobsStatus === "ready" && jobs.length === 0 && (
                  <div style={{ padding: "64px 20px", textAlign: "center", color: "#71717a", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={{ fontSize: "15px", fontWeight: "600", color: "#18181b" }}>No open positions right now</span>
                    <span style={{ fontSize: "13px", color: "#71717a", maxWidth: "340px", lineHeight: "1.5" }}>Check back soon — new roles are posted regularly.</span>
                  </div>
                )}

                {jobsStatus === "ready" && jobs.length > 0 && (
                  filteredJobs.length > 0 ? (
                    filteredJobs.map((job, idx) => (
                      <div
                        key={job.id ?? idx}
                        onClick={() => openJobModal(job)}
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
                          {/* Safe Pipe Separators used to prevent question marks */}
                          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#71717a" }}>
                            {job.department} | {job.experience} | {job.workMode}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                          <span style={{ fontSize: "14px", color: "#18181b", fontWeight: "500" }}>{job.location}</span>
                          <span style={{ color: "#18181b", display: "inline-flex" }}>
                            {getArrow()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "64px 20px", textAlign: "center", color: "#71717a", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span style={{ fontSize: "15px", fontWeight: "600", color: "#18181b" }}>No opportunities match your criteria</span>
                      <span style={{ fontSize: "13px", color: "#71717a", maxWidth: "340px", lineHeight: "1.5" }}>Try adjusting your filters or search query to find open positions in other functions or locations.</span>
                    </div>
                  )
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Spacer transition: Light to Dark (White to Black) */}
      <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>

      {/* JOB DETAIL / APPLY OVERLAY MODAL */}
      {selectedJob && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            zIndex: 1000,
            display: "grid",
            placeItems: "center",
            padding: "24px",
            backdropFilter: "blur(5px)"
          }}
          onClick={closeJobModal}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4e4e7",
              borderRadius: "var(--radius)",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "40px",
              position: "relative",
              boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
              textAlign: "left"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button via clean SVG icon */}
            <button
              onClick={closeJobModal}
              style={{
                position: "absolute",
                right: "24px",
                top: "24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#71717a",
                lineHeight: 1,
                display: "inline-flex"
              }}
              aria-label="Close details"
            >
              {getCloseIcon()}
            </button>

            {/* Header info */}
            <div style={{ marginBottom: "28px" }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#2f6bff", fontWeight: "700", letterSpacing: "0.08em" }}>
                {selectedJob.department.toUpperCase()}
              </span>
              <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#18181b", marginTop: "8px" }}>
                {selectedJob.title}
              </h2>

              {/* Emojis replaced with clean inline SVG icons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "16px", fontSize: "13.5px", color: "#71717a" }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Location: <strong style={{ marginLeft: "4px" }}>{selectedJob.location}</strong>
                </span>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  Experience: <strong style={{ marginLeft: "4px" }}>{selectedJob.experience}</strong>
                </span>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Work Mode: <strong style={{ marginLeft: "4px" }}>{selectedJob.workMode}</strong>
                </span>
              </div>
            </div>

            {/* Divider line */}
            <div style={{ height: "1px", background: "#e4e4e7", marginBlock: "24px" }}></div>

            {applyMode ? (
              applyStatus === "success" ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#18181b", marginBottom: "10px" }}>Application received!</h3>
                  <p style={{ fontSize: "13.5px", color: "#44444a", lineHeight: "1.6", marginBottom: "24px" }}>
                    We'll review it and get back to you if it's a good fit.
                  </p>
                  <button onClick={closeJobModal} className="btn btn-dark" style={{ padding: "12px 24px" }}>Close</button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#18181b", marginBottom: "16px" }}>Apply for this role</h3>

                  <div style={{ display: "grid", gap: "16px" }}>
                    <div className="form-group">
                      <label htmlFor="ap-name" style={{ color: "#71717a" }}>Your Name *</label>
                      <input
                        id="ap-name"
                        type="text"
                        required
                        value={applyName}
                        onChange={(e) => setApplyName(e.target.value)}
                        disabled={applyStatus === "loading"}
                        style={{ padding: "12px 14px", borderRadius: "6px", border: "1px solid #e4e4e7", fontSize: "13.5px", color: "#18181b" }}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ap-email" style={{ color: "#71717a" }}>Your Email *</label>
                      <input
                        id="ap-email"
                        type="email"
                        required
                        value={applyEmail}
                        onChange={(e) => setApplyEmail(e.target.value)}
                        disabled={applyStatus === "loading"}
                        style={{ padding: "12px 14px", borderRadius: "6px", border: "1px solid #e4e4e7", fontSize: "13.5px", color: "#18181b" }}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ap-phone" style={{ color: "#71717a" }}>Phone</label>
                      <input
                        id="ap-phone"
                        type="tel"
                        value={applyPhone}
                        onChange={(e) => setApplyPhone(e.target.value)}
                        disabled={applyStatus === "loading"}
                        style={{ padding: "12px 14px", borderRadius: "6px", border: "1px solid #e4e4e7", fontSize: "13.5px", color: "#18181b" }}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ap-cover" style={{ color: "#71717a" }}>Cover Note (optional)</label>
                      <textarea
                        id="ap-cover"
                        rows={4}
                        maxLength={2000}
                        value={applyCoverNote}
                        onChange={(e) => setApplyCoverNote(e.target.value)}
                        disabled={applyStatus === "loading"}
                        style={{ padding: "12px 14px", borderRadius: "6px", border: "1px solid #e4e4e7", fontSize: "13.5px", color: "#18181b", resize: "vertical" }}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ap-resume" style={{ color: "#71717a" }}>Resume (PDF, max 5 MB) *</label>
                      <input
                        id="ap-resume"
                        type="file"
                        accept="application/pdf,.pdf"
                        required
                        onChange={handleResumeChange}
                        disabled={applyStatus === "loading"}
                        style={{ fontSize: "13px", color: "#18181b" }}
                      />
                    </div>

                    {/* Honeypot: invisible to real users, catches bots that fill every field. */}
                    <input
                      type="text"
                      name="hp_field_x"
                      value={applyHp}
                      onChange={(e) => setApplyHp(e.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
                      aria-hidden="true"
                      style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
                    />

                    {applyError && (
                      <p style={{ color: "#dc2626", fontSize: "13px" }}>{applyError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={applyStatus === "loading"}
                      className="btn btn-dark"
                      style={{ width: "100%", padding: "14px", fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    >
                      {applyStatus === "loading" ? "Submitting…" : "Submit Application"}
                    </button>
                    <p style={{ fontSize: "11px", color: "#a1a1aa", textAlign: "center", marginTop: "-8px" }}>
                      Your details are used only to evaluate your application.
                    </p>

                    <button
                      type="button"
                      onClick={() => setApplyMode(false)}
                      disabled={applyStatus === "loading"}
                      style={{ background: "none", border: "none", color: "#71717a", fontSize: "13px", cursor: "pointer", justifySelf: "center" }}
                    >
                      ← Back to role details
                    </button>
                  </div>
                </form>
              )
            ) : (
              <>
                {/* About role */}
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#18181b", marginBottom: "8px" }}>About the Role</h3>
                  <p style={{ fontSize: "13.5px", lineHeight: "1.65", color: "#44444a" }}>
                    {selectedJob.about}
                  </p>
                </div>

                {/* Key Responsibilities */}
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#18181b", marginBottom: "12px" }}>Key Responsibilities</h3>
                  <ul style={{ display: "grid", gap: "8px", paddingLeft: "20px", listStyleType: "disc" }}>
                    {selectedJob.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} style={{ fontSize: "13.5px", lineHeight: "1.6", color: "#44444a" }}>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div style={{ marginBottom: "32px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#18181b", marginBottom: "12px" }}>Requirements</h3>
                  <ul style={{ display: "grid", gap: "8px", paddingLeft: "20px", listStyleType: "disc" }}>
                    {selectedJob.requirements.map((req, reqIdx) => (
                      <li key={reqIdx} style={{ fontSize: "13.5px", lineHeight: "1.6", color: "#44444a" }}>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Apply Action Button */}
                <button
                  onClick={() => setApplyMode(true)}
                  className="btn btn-dark"
                  style={{ width: "100%", padding: "14px", fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  Apply for this Position {getArrow()}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

