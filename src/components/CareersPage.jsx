import React, { useState, useEffect } from "react"

export default function CareersPage() {
  const [gradNum, setGradNum] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFunc, setActiveFunc] = useState("All")
  const [activeLoc, setActiveLoc] = useState("All")
  const [activeExp, setActiveExp] = useState("All")
  const [activeMode, setActiveMode] = useState("All")
  const [selectedJob, setSelectedJob] = useState(null)

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

  const jobs = [
    { 
      title: "AI/ML Engineer", 
      location: "Noida", 
      department: "Engineering", 
      experience: "Senior (5+ yrs)",
      workMode: "On-site",
      about: "Evoletrix is seeking a production-focused AI/ML Engineer to design, build, and deploy robust machine learning models and intelligent agentic architectures. You will take charge of our AI capabilities from model selection to secure API delivery.",
      responsibilities: [
        "Design, train, and optimize deep learning algorithms for client workflows.",
        "Implement high-performance Retrieval-Augmented Generation (RAG) search engines.",
        "Integrate autonomous agentic pipelines to automate complex data processing tasks.",
        "Work closely with DevOps to deploy models inside containerized GPU servers."
      ],
      requirements: [
        "3+ years of professional machine learning development experience.",
        "Strong proficiency in Python, PyTorch/TensorFlow, and Hugging Face library.",
        "Deep familiarity with vector databases (Pinecone, pgvector) and embeddings.",
        "Experience optimizing model latency and memory footprints in cloud setups."
      ]
    },
    { 
      title: "Tech Lead Node.js", 
      location: "Noida", 
      department: "Engineering", 
      experience: "Senior (5+ yrs)",
      workMode: "Hybrid",
      about: "We are looking for a hands-on Tech Lead to architect and optimize our Node.js microservices. You will guide backend engineering standards, enforce database reliability, and mentor a talented engineering team.",
      responsibilities: [
        "Architect and maintain highly scalable RESTful and GraphQL API servers.",
        "Manage SQL and NoSQL database schemas, queries, and optimization strategies.",
        "Oversee security compliance, authentication tokens, and rate limiters.",
        "Review pull requests and enforce test coverage, clean code patterns, and speed profiles."
      ],
      requirements: [
        "6+ years of professional backend development with Node.js and Express.",
        "Expertise in PostgreSQL/MySQL query tuning and index management.",
        "Familiarity with Redis caching, Docker containerization, and AWS hosting.",
        "Exceptional technical leadership and communication capabilities."
      ]
    },
    { 
      title: "Social Media Executive", 
      location: "Noida", 
      department: "Marketing", 
      experience: "Junior (1-3 yrs)",
      workMode: "On-site",
      about: "Join our growth squad to amplify Evoletrix`s brand presence across digital networks. You will translate complex software projects and engineering stories into engaging, reader-friendly content.",
      responsibilities: [
        "Curate, schedule, and moderate visual content on LinkedIn, X (Twitter), and tech forums.",
        "Analyze traffic data and campaign conversions to optimize community outreach.",
        "Collaborate with developers and UI designers to draft informative carousel slide decks."
      ],
      requirements: [
        "1-3 years of marketing or social media management experience.",
        "Exceptional copywriting skills with an eye for technical storytelling.",
        "Familiarity with visual design tools like Figma or Canva.",
        "Prior experience in B2B SaaS or technical consultancy agencies is a huge plus."
      ]
    },
    { 
      title: "Full Stack Developer", 
      location: "Faridabad", 
      department: "Engineering", 
      experience: "Mid-level (3-5 yrs)",
      workMode: "Hybrid",
      about: "We are looking for a versatile Full Stack Developer to build interactive client dashboards. You will bridge frontend interfaces with server-side microservices.",
      responsibilities: [
        "Implement pixel-perfect UI screens in React.js and Tailwind CSS.",
        "Develop backend endpoint logic, data validations, and database hooks in Node.js.",
        "Write comprehensive unit tests and optimize website core vitals."
      ],
      requirements: [
        "3+ years of full-stack engineering experience.",
        "Advanced command of JavaScript/TypeScript, React.js, Node.js, and CSS.",
        "Experience utilizing PostgreSQL or MongoDB database architectures.",
        "Familiarity with Git branching and Vercel/Render deployments."
      ]
    },
    { 
      title: "Senior UI/UX Designer", 
      location: "Noida", 
      department: "Design", 
      experience: "Senior (5+ yrs)",
      workMode: "Remote",
      about: "Evoletrix is seeking a Senior UI/UX Designer to craft premium product mockups and design tokens for digital portals. You will lead client design discovery sessions.",
      responsibilities: [
        "Define typography, spacing grids, and component libraries inside Figma.",
        "Design wireframes, high-fidelity mockups, and interactive prototypes.",
        "Collaborate with developers to align CSS styling with the original layouts."
      ],
      requirements: [
        "5+ years of digital product UI/UX design experience.",
        "Outstanding design portfolio showcasing clean, grid-based typography.",
        "Advanced proficiency in Figma, design systems, and responsive layouts."
      ]
    },
    { 
      title: "DevOps Architect", 
      location: "Noida", 
      department: "Engineering", 
      experience: "Senior (5+ yrs)",
      workMode: "Remote",
      about: "Scale and secure our cloud infrastructure. You will optimize CI/CD pipelines, coordinate deployments, and audit environment security.",
      responsibilities: [
        "Build and monitor containerized cluster stacks in AWS and GCP.",
        "Optimize automated Git actions, unit testing triggers, and static checking.",
        "Configure CDN layers, firewalls, and server encryption standards."
      ],
      requirements: [
        "5+ years of DevOps or Cloud infrastructure experience.",
        "Excellent command of Docker, Terraform, Kubernetes, and GitHub Actions.",
        "Deep familiarity with server security audits and hosting cost control."
      ]
    },
    { 
      title: "GIS Specialist", 
      location: "Faridabad", 
      department: "Engineering", 
      experience: "Mid-level (3-5 yrs)",
      workMode: "On-site",
      about: "Work inside our mapping team to coordinate spatial database indexing and render high-resolution raster files on interactive maps.",
      responsibilities: [
        "Manage, clean, and convert geospatial data projections (raster and shapefiles).",
        "Write and optimize PostGIS queries and custom Python geoprocessing algorithms.",
        "Integrate geofences and maps into frontend React dashboards via Mapbox APIs."
      ],
      requirements: [
        "3+ years of experience working with GIS tools and databases.",
        "Strong capabilities in PostGIS, Python (GDAL, Shapely), and JavaScript maps.",
        "Excellent grasp of coordinates, geodetic projections, and coordinate datums."
      ]
    },
    { 
      title: "Product Manager", 
      location: "Remote", 
      department: "Product Management", 
      experience: "Senior (5+ yrs)",
      workMode: "Remote",
      about: "Evoletrix is seeking a Product Manager to translate business goals into sprint milestones. You will coordinate with developers and report progress to stakeholders.",
      responsibilities: [
        "Define detailed product scopes, specifications, and backlog milestones.",
        "Lead client alignment calls, prioritize tasks, and resolve team blockers.",
        "Validate user flows and coordinate launch strategies."
      ],
      requirements: [
        "5+ years of software product management experience.",
        "Strong technical understanding of APIs, data flow, and frontend components.",
        "Outstanding documentation, task tracking, and communication habits."
      ]
    }
  ]
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
              <div style={{ color: "#71717a", fontSize: "13px", fontWeight: "600" }}>
                Showing {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"}
              </div>

              {/* Jobs List */}
              <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e4e4e7" }}>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedJob(job)}
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
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Spacer transition: Light to Dark (White to Black) */}
      <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>

      {/* JOB DETAIL OVERLAY MODAL */}
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
          onClick={() => setSelectedJob(null)}
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
              onClick={() => setSelectedJob(null)}
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
              onClick={() => {
                alert("Redirecting to Application Form...");
                // Note: You can replace this action with a Google Form or custom submission URL later
                window.open("https://docs.google.com/forms", "_blank");
              }}
              className="btn btn-dark"
              style={{ width: "100%", padding: "14px", fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              Apply for this Position {getArrow()}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

