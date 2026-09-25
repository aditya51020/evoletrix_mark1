import React, { useState } from "react"
import useIsMobile from "../hooks/useIsMobile"
import MobileAccordionCard from "./MobileAccordionCard"

export default function ServicesPage() {
  const isMobile = useIsMobile()
  const [mobileOpenIdx, setMobileOpenIdx] = useState(null)

  // Desktop only: drives the grid card's selected border and the details
  // panel content. No separate hover state — hover is pure CSS (:hover)
  // and never touches selection, and there's no deselected state since
  // the panel always needs something to show.
  const [selectedIdx, setSelectedIdx] = useState(0)

  // Desktop grid card click: selects it. Clicking the already-selected
  // card is a no-op (no deselect — the panel always needs something to show).
  const handleCardClick = (idx) => {
    if (idx === selectedIdx) return
    setSelectedIdx(idx)
  }

  const handleCardKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleCardClick(idx)
    }
  }

  const getIcon = (iconName) => {
    switch (iconName) {
      case "product":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>
      case "outsourcing":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      case "transformation":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-.01M17 14h.01M13 18h.01M12 6h.01"/><path d="M22 12a10 10 0 1 1-10-10c.85 0 1.67.1 2.47.3"/></svg>
      case "datacenter":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/><line x1="10" y1="6" x2="14" y2="6"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
      case "data":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
      default:
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
    }
  }

  const services = [
    {
      num: "01",
      key: "product",
      title: "Product Development & Engineering",
      desc: "We design and build robust, clean, and highly scalable software solutions tailored to fit your unique business requirements.",
      points: [
        "Product Design & Wireframes",
        "Application Development (iOS & Web)",
        "Software Engineering Architectures",
        "QA, Automation & Performance Testing",
        "DevOps & Secure CI/CD Pipelines",
        "Technical Product Management"
      ]
    },
    {
      num: "02",
      key: "datacenter",
      title: "Data Center Services",
      desc: "We design, build, and operate enterprise data centers from the ground up, covering network fabric, high-speed interconnects, and day-to-day operations for mission-critical infrastructure.",
      points: [
        "Data Center Build, Implementation & Operations",
        "Greenfield Design — Built From the Ground Up",
        "VxLAN Network Fabric",
        "InfiniBand High-Speed Interconnects",
        "SD-WAN & Firewall Deployment",
        "Network Automation"
      ]
    },
    {
      num: "03",
      key: "outsourcing",
      title: "IT Managed & Outsourcing",
      desc: "Hire dedicated development squads or choose structured milestone-driven execution for your critical engineering backlogs.",
      points: [
        "Dedicated Engineering Squads",
        "Software Compliance & IT Audits",
        "Managed Infrastructure Teams",
        "Flexible Resource Augmentation"
      ]
    },
    {
      num: "04",
      key: "transformation",
      title: "Digital Transformation",
      desc: "Modernize legacy systems, migrate to fast cloud hosting, and integrate advanced smart contracts securely.",
      points: [
        "Legacy Application Modernization",
        "Blockchain & Smart Contract Audit",
        "AWS, GCP & Azure Cloud Migration",
        "Cybersecurity Auditing & Hardening",
        "IoT Telemetry Integrations",
        "AR/VR Interactive Applications"
      ]
    },
    {
      num: "05",
      key: "data",
      title: "Data Services",
      desc: "Build automated ingestion pipelines, design data warehouses, and render real-time interactive business analytics dashboards.",
      points: [
        "Big Data Processing pipelines",
        "Custom Machine Learning Models",
        "Data Analytics & Custom Warehousing",
        "Real-time Telemetry Dashboards"
      ]
    }
  ]

  const expertises = [
    {
      title: "Artificial Intelligence",
      desc: "AI only creates value when it fits into how an organization actually works. We help enterprises apply intelligence in ways that improve decisions, reduce manual effort, and support operations at scale.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>,
      underline: true
    },
    {
      title: "Generative AI",
      desc: "Gen AI is most useful when it becomes part of everyday work. We integrate it into internal knowledge systems, customer interactions, and operational tools, with the controls and governance enterprises expect.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1M3 12h1m16 0h1m-2.64-7.36.7.7m-11.44 11.4.7.7m0-12.8.7-.7m11.44 11.4.7-.7"/></svg>,
      underline: false
    },
    {
      title: "Agentic AI",
      desc: "We work with organizations exploring autonomous systems, helping them introduce AI agents that can take action across processes while remaining transparent, supervised, and accountable.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><circle cx="12" cy="12" r="10"/></svg>,
      underline: false
    },
    {
      title: "Machine Learning",
      desc: "ML in enterprise environments is less about experimentation and more about reliability. We develop models that adapt over time and continue to perform as data, demand, and conditions change.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
      underline: false
    },
    {
      title: "Computer Vision",
      desc: "In environments where speed and accuracy matter, vision-based systems can remove friction. We apply computer vision to automate inspection, monitoring, and visual analysis across real operational settings.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9z"/></svg>,
      underline: false
    },
    {
      title: "Cloud",
      desc: "Cloud modernization is not a lift-and-shift exercise. We help enterprises rethink how applications and infrastructure are structured so systems remain secure, resilient, and ready to scale over time.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 1-9.9Z"/></svg>,
      underline: false
    },
    {
      title: "Data Science and Analytics",
      desc: "Data only becomes useful when teams can rely on it. We design data foundations that support analytics and insight across functions, without adding complexity or dependency.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
      underline: false
    },
    {
      title: "Cybersecurity",
      desc: "Security is treated as a design constraint, not a checklist item. Our systems account for governance, compliance, and risk from the earliest architectural decisions.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      underline: false
    },
    {
      title: "IoT",
      desc: "Connected devices generate value only when their data is usable. We help organizations bring physical systems into their digital landscape, improving visibility and control across operations.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
      underline: false
    },
    {
      title: "AR/VR",
      desc: "Immersive technologies work best when they solve specific problems. We use AR and VR to support training, simulation, and remote collaboration in enterprise environments.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1.5M21 16.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5M10 9a2 2 0 1 0 0 4h4a2 2 0 1 0 0-4h-4Z"/></svg>,
      underline: false
    },
    {
      title: "Blockchain",
      desc: "Distributed systems are useful where trust must be shared. We apply blockchain selectively, focusing on traceability, data integrity, and controlled exchange in multi-party ecosystems.",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
      underline: true
    }
  ]

  return (
    <>
      <section className="section services-page-section" aria-labelledby="srvTitle" style={{ paddingBlock: "96px 64px" }}>
        <div className="shell">
          <header className="ind-page-header" style={{ marginBottom: "64px" }}>
            <h1 id="srvTitle" className="display" style={{ marginBottom: "16px" }}>Our Services</h1>
            <p className="ind-page-sub">
              Evoletrix delivers end-to-end product design, full-stack application development, and secure GIS/cloud scaling.
            </p>
          </header>

          {/* Responsive Layout Switch */}
          {isMobile ? (
            /* Mobile: inline accordion — tapping a card expands its info
               directly below it, one open at a time. */
            <div className="mobile-accordion-list">
              {services.map((srv, idx) => (
                <MobileAccordionCard
                  key={idx}
                  id={`service-${idx}`}
                  isOpen={mobileOpenIdx === idx}
                  onToggle={() => setMobileOpenIdx((prev) => (prev === idx ? null : idx))}
                  triggerClassName={`ind-card mobile-accordion-trigger ${mobileOpenIdx === idx ? "is-selected" : ""}`}
                  triggerContent={
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div className="ind-icon-wrapper" style={{ margin: 0, flexShrink: 0 }}>
                        {getIcon(srv.key)}
                      </div>
                      <span className="ind-title" style={{ fontSize: "15px", fontWeight: "600" }}>
                        {srv.title}
                      </span>
                    </div>
                  }
                  panelContent={
                    <div className="mobile-accordion-panel-content">
                      <p style={{ color: "#44444a", fontSize: "13.5px", lineHeight: "1.6", marginBottom: "20px" }}>
                        {srv.desc}
                      </p>

                      <h4 style={{ fontSize: "11px", fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--fg-dim)", letterSpacing: "0.08em", marginBottom: "12px" }}>
                        WHAT WE OFFER
                      </h4>
                      <ul style={{ display: "grid", gap: "10px", marginBottom: "24px" }}>
                        {srv.points.map((pt, pIdx) => (
                          <li key={pIdx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <span style={{ color: "var(--brand)", fontWeight: "bold", fontSize: "15px" }}>|</span>
                            <span style={{ color: "#27272a", fontSize: "13.5px" }}>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                        className="btn btn-dark"
                        style={{ width: "100%", padding: "14px", fontSize: "14px", fontWeight: "700" }}
                      >
                        Discuss this service →
                      </button>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            /* Desktop Master-Detail Layout */
            <div className="ind-split-layout" style={{ gridTemplateColumns: "0.9fr 1.1fr" }}>
              
              {/* Master List (Left side) */}
              <div 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "14px", 
                  height: "calc(100vh - 160px)", 
                  minHeight: "540px" 
                }}
              >
                {services.map((srv, idx) => {
                  const isSelected = selectedIdx === idx
                  return (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-label={srv.title}
                      className={`ind-card ${isSelected ? "is-selected" : ""}`}
                      style={{
                        aspectRatio: "auto",
                        padding: "20px 24px",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        gap: "20px",
                        flex: 1
                      }}
                      onClick={() => handleCardClick(idx)}
                      onKeyDown={(e) => handleCardKeyDown(e, idx)}
                    >
                      <div className="ind-icon-wrapper" style={{ margin: "0", flexShrink: 0 }}>
                        {getIcon(srv.key)}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left" }}>
                        <span className="ind-title" style={{ fontSize: "15px", fontWeight: "600" }}>
                          {srv.title}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Details Panel (Right side) */}
              <div className="ind-details-panel" style={{ height: "calc(100vh - 160px)", minHeight: "540px" }}>
                <div className="ind-details-visual-header">
                  <span className="ind-details-visual-icon">
                    {getIcon(services[selectedIdx].key)}
                  </span>
                </div>

                <div className="ind-details-content">
                  <h3 style={{ marginTop: "6px", fontSize: "22px" }}>{services[selectedIdx].title}</h3>

                  <div className="ind-details-section">
                    <p className="ind-details-desc">{services[selectedIdx].desc}</p>
                  </div>

                  <div className="ind-details-section" style={{ marginTop: "20px" }}>
                    <h4>WHAT WE OFFER</h4>
                    <ul style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
                      {services[selectedIdx].points.map((pt, pIdx) => (
                        <li key={pIdx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <span style={{ color: "var(--brand)", fontWeight: "bold", fontSize: "15px" }}>|</span>
                          <span style={{ color: "#27272a", fontSize: "13.5px" }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                  className="btn btn-dark ind-details-btn"
                >
                  Discuss this service →
                </button>
              </div>
              
            </div>
          )}
        </div>
      </section>

      {/* Spacer transition: Dark to Light (Black to White) */}
      <div className="bg-transition-spacer" aria-hidden="true"></div>

      {/* NEW SECTION: Deep Technical Expertise (Light Theme, Image 1 & 2 inspired) */}
      <section className="section outcomes theme-light-block" style={{ paddingBlock: "96px 48px" }}>
        <div className="shell">
          <header className="ind-page-header" style={{ marginBottom: "64px" }}>
            <h2 className="display" style={{ color: "var(--light-fg)", fontSize: "36px", fontWeight: "700" }}>
              Deep Technical Expertise, Supporting Modern Systems
            </h2>
          </header>

          {/* Grid layout for 11 expertises */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px 32px" }} className="stats-grid-about">
            {expertises.map((exp, idx) => (
              <div key={idx} className="exp-card">
                {/* Clean inline SVG header icon inside transition wrapper */}
                <div className="exp-icon">
                  {exp.icon}
                </div>

                {/* Card Title with animated hover underline */}
                <h3 className="exp-title">
                  {exp.title}
                </h3>

                <p style={{ color: "#44444a", fontSize: "13.5px", lineHeight: "1.65", margin: 0 }}>
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Light CTA Section */}
      <section className="section outcomes theme-light-block" style={{ paddingBlock: "48px 96px" }}>
        <div className="shell" style={{ textAlign: "center" }}>
          <h2 className="display" style={{ color: "var(--light-fg)", marginBottom: "16px" }}>Ready to bring your product to life?</h2>
          <p style={{ color: "var(--fg-dim)", fontSize: "16px", maxWidth: "600px", margin: "0 auto 32px" }}>
            Schedule a session to connect with our core squad in Faridabad or consult virtually to outline your project milestones.
          </p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
            className="btn btn-dark btn-lg"
          >
            Let's chat over coffee →
          </button>
        </div>
      </section>

      {/* Spacer transition: Light to Dark (White to Black) */}
      <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>
    </>
  )
}
