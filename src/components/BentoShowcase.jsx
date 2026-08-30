import React from "react"

export default function BentoShowcase() {
  return (
    <section className="section bento-showcase" id="services" aria-label="Evoletrix Startup Playbook">
      <div className="shell">
        <span className="pill-tag reveal" style={{ marginBottom: "20px" }}>◼ HOW WE BUILD STARTUPS</span>
        <h2 className="display reveal" style={{ color: "var(--fg)", marginBottom: "40px" }}>
          From concept to scale:<br />Our startup engineering playbook
        </h2>
        
        <div className="bento-grid">
          {/* Card 1: Phase 01 */}
          <article className="bento-card panel reveal">
            <header className="panel-head">
              <span className="mono-tag">PHASE 01 / ARCHITECTURE</span>
            </header>
            <h3>UX/UI &amp; System Design</h3>
            <p style={{ fontSize: "14px", color: "var(--fg-muted)", margin: "10px 0 20px", lineHeight: "1.5" }}>
              We map your business logic into clickable UI wireframes, relational database schemas, and structured API endpoints before writing any code.
            </p>
            <div className="fake-search">
              <span className="fs-icon" aria-hidden="true">⌕</span>
              <span className="fs-placeholder">search startup templates…</span>
            </div>
            <ul className="tool-list">
              <li><span className="dot dot-a"></span> Front-End Wireframes<em>Interactive UI mockups</em></li>
              <li><span className="dot dot-b"></span> DB Schema Design<em>PostgreSQL &amp; Redis models</em></li>
              <li><span className="dot dot-c"></span> Architecture Map<em>Scalable microservices flow</em></li>
            </ul>
          </article>

          {/* Card 2: Phase 02 */}
          <article className="bento-card bento-card--chat panel reveal">
            <header className="chat-head">
              <span className="chat-model" aria-hidden="true">✦</span>
              <strong>Evoletrix Devops</strong>
              <span className="muted">Staging</span>
            </header>
            <div className="chat-bubble">
              Deployment pipeline triggered. Compiling React frontend and mounting FastAPI endpoints.
            </div>
            <div className="chat-exec">
              <span className="mono-tag mono-tag--inline">BUILD_RUN</span>
              <span>CI/CD Status: Success</span>
            </div>
            <div className="chat-result">
              Staging dashboard updated. Database migrations completed successfully. Server latency: 12ms.
            </div>
            <div className="chat-reply">
              <span className="chat-plus" aria-hidden="true">+</span>
              <span className="chat-reply-placeholder">Deploy to Production…</span>
              <span className="chat-model-chip">AWS VPC</span>
              <button className="chat-send" aria-label="Send">↑</button>
            </div>
          </article>

          {/* Card 3: Phase 03 */}
          <article className="bento-card panel reveal">
            <header className="panel-head">
              <span className="mono-tag">PHASE 03 / GO LIVE</span>
            </header>
            <h3>Production Launch</h3>
            <p style={{ fontSize: "14px", color: "var(--fg-muted)", margin: "10px 0 20px", lineHeight: "1.5" }}>
              We handle the hosting orchestration. Deploy securely into your cloud accounts with automatic failovers and monitoring.
            </p>
            <p className="mono-line">CLUSTER_ID: evo_production_nodes</p>
            <div className="conn-row">
              <span className="conn-name"><span className="dot dot-b"></span> Secure AWS VPC</span>
              <span className="conn-meta">Active</span>
            </div>
            <div className="conn-row">
              <span className="conn-name"><span className="dot dot-a"></span> Database Replica</span>
              <span className="conn-meta">Synced</span>
            </div>
            <div className="conn-row">
              <span className="conn-name"><span className="dot dot-c"></span> SSL/TLS &amp; WAF</span>
              <span className="conn-meta">Shield On</span>
            </div>
            <p className="ok-line"><span className="ok-check">✓</span> Live environment online · 100% active</p>
          </article>
        </div>

        {/* Sandbox strip: Phase 04 */}
        <div className="sandbox-panel panel reveal">
          <header className="sandbox-head">
            <span className="mono-tag">PHASE 04 / ADVANCED INTEGRATION</span>
            <span className="mono-line">● GIS, AI &amp; Big Data Sandbox</span>
          </header>
          <div style={{ marginBottom: "20px", fontSize: "14px", color: "var(--fg-muted)", lineHeight: "1.6" }}>
            Once launched, we integrate advanced technologies to match your scale: GIS coordinate geoprocessing maps, custom LLM agents, and high-frequency analytical dashboards.
          </div>
        </div>
      </div>
    </section>
  )
}
