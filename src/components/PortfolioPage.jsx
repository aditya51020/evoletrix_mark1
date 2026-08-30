import React from "react"

export default function PortfolioPage() {
  const projects = [
    {
      brand: "HEALTHSYNC",
      category: "Healthcare",
      desc: "Built a fully HIPAA-compliant patient diagnostics and clinical records sync portal.",
      metric: "Reduced diagnostic record latency by 45% across clinics.",
      grad: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 19V5"/></svg>
    },
    {
      brand: "TRUST PAY",
      category: "FinTech & Banking",
      desc: "Designed and engineered a high-volume custom currency settlement ledger.",
      metric: "Settles $500k+ in daily volumes with audited, zero-fault transaction trails.",
      grad: "linear-gradient(135deg, #10b981, #059669)",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
    },
    {
      brand: "QUICKCAB",
      category: "On-Demand Logistics",
      desc: "Developed a real-time driver dispatch matching algorithm and mapping dashboard.",
      metric: "Reduced dispatch match times to under 2 seconds during peak hours.",
      grad: "linear-gradient(135deg, #f59e0b, #d97706)",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"/></svg>
    },
    {
      brand: "PLCMONITOR",
      category: "IoT Manufacturing",
      desc: "Integrated factory automation uptime sensor streams with central PLC controllers.",
      metric: "Decreased unscheduled machinery downtime by 14% across plant lines.",
      grad: "linear-gradient(135deg, #6366f1, #4f46e5)",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></svg>
    },
    {
      brand: "SOLARGRID",
      category: "Clean Energy",
      desc: "Constructed solar energy output modeling dashboards with predictive analytics.",
      metric: "Processes 10M+ daily telemetry data points for municipal power grids.",
      grad: "linear-gradient(135deg, #ec4899, #db2777)",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2v20M5 12h14"/></svg>
    },
    {
      brand: "NEWSENGINE",
      category: "Digital Media",
      desc: "Pioneered serverless editorial backends and global CDN publishing layout.",
      metric: "Seamlessly delivers page caching for 1M+ active monthly readers.",
      grad: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 22h16M4 18h16"/></svg>
    }
  ]

  return (
    <>
      <section className="section portfolio-page-section" aria-labelledby="portTitle" style={{ paddingBlock: "96px 64px" }}>
        <div className="shell">
          <header className="ind-page-header" style={{ marginBottom: "64px" }}>
            <h1 id="portTitle" className="display" style={{ marginBottom: "16px" }}>Our Work</h1>
            <p className="ind-page-sub">
              Explore the custom applications, database engineering, and scaling projects we constructed for our global partners.
            </p>
          </header>

          {/* Grid of Portfolio Cards (Image 2 style visual header + White background body) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }} className="port-grid">
            {projects.map((proj, idx) => (
              <div 
                key={idx} 
                className="port-card"
                style={{ 
                  background: "#ffffff", 
                  border: "1px solid rgba(0, 0, 0, 0.08)", 
                  borderRadius: "var(--radius)", 
                  overflow: "hidden", 
                  display: "flex", 
                  flexDirection: "column",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)"
                }}
              >
                {/* Image/Gradient top block with centered icon - Like Image 2 */}
                <div 
                  style={{ 
                    height: "120px", 
                    background: proj.grad, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    margin: "20px 20px 0 20px", 
                    borderRadius: "var(--radius-sm)" 
                  }}
                >
                  <span 
                    style={{ 
                      width: "44px", 
                      height: "44px", 
                      borderRadius: "50%", 
                      background: "rgba(255, 255, 255, 0.18)", 
                      border: "1px solid rgba(255,255,255,0.3)", 
                      display: "grid", 
                      placeItems: "center", 
                      color: "#ffffff" 
                    }}
                  >
                    {proj.icon}
                  </span>
                </div>

                {/* Card Content area */}
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--brand)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                    {proj.category}
                  </span>
                  
                  {/* Brand logo style text - Like Image 3 */}
                  <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-mono)", color: "#18181b", letterSpacing: "0.05em", margin: "4px 0 12px 0" }}>
                    {proj.brand}
                  </h3>

                  <p style={{ color: "#44444a", fontSize: "13.5px", lineHeight: "1.6", marginBottom: "16px" }}>
                    {proj.desc}
                  </p>

                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "14px", marginTop: "auto" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", fontFamily: "var(--font-mono)", color: "#71717a", display: "block", marginBottom: "4px" }}>
                      KEY METRIC
                    </span>
                    <p style={{ color: "#18181b", fontSize: "13px", fontWeight: "600", lineHeight: "1.4" }}>
                      {proj.metric}
                    </p>
                  </div>

                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                    className="btn btn-dark" 
                    style={{ background: "#18181b", color: "#ffffff", border: "none", marginTop: "24px", width: "100%", justifyContent: "center" }}
                  >
                    View Case Study →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer transition: Dark to Light (Black to White) */}
      <div className="bg-transition-spacer" aria-hidden="true"></div>

      {/* Light CTA Section */}
      <section className="section outcomes theme-light-block" style={{ paddingBlock: "96px" }}>
        <div className="shell" style={{ textAlign: "center" }}>
          <h2 className="display" style={{ color: "var(--light-fg)", marginBottom: "16px" }}>Have a unique project in mind?</h2>
          <p style={{ color: "var(--fg-dim)", fontSize: "16px", maxWidth: "600px", margin: "0 auto 32px" }}>
            Let's discuss how we can build high-performance, secure cloud products for your target sectors.
          </p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
            className="btn btn-dark btn-lg"
          >
            Start a project →
          </button>
        </div>
      </section>

      {/* Spacer transition: Light to Dark (White to Black) */}
      <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>
    </>
  )
}
