import React from "react"

export default function OutcomesSection() {
  return (
    <section className="section outcomes theme-light-block" id="solutions-outcomes" aria-labelledby="outTitle">
      <div className="shell">
        <span className="pill-tag reveal">◼ CASE STUDIES</span>
        <h2 id="outTitle" className="display reveal">What we ship for our clients</h2>
        <div className="outcomes-grid">
          <article className="outcome-card reveal">
            <span className="oc-kicker">Health Software</span>
            <span className="oc-metric">HIPAA</span>
            <p>Designed and built a secure, HIPAA-compliant patient diagnostics dashboard for an emerging healthcare provider in 12 weeks.</p>
          </article>
          <article className="outcome-card reveal">
            <span className="oc-kicker">Education LMS</span>
            <span className="oc-metric">10k+</span>
            <p>Engineered an interactive learning management system capable of handling thousands of concurrent live student video streams.</p>
          </article>
          <article className="outcome-card reveal">
            <span className="oc-kicker">Custom ERP</span>
            <span className="oc-metric">-35%</span>
            <p>Built a unified operations ERP that integrated supply chain data, reducing manual invoice processing times.</p>
          </article>
          <article className="outcome-card outcome-card--wide reveal">
            <span className="oc-kicker">GIS Mapping</span>
            <span className="oc-metric">0.5M</span>
            <p>Designed a georeferencing and GIS analytics system for land mapping, managing over half a million active spatial coordinates with offline caching.</p>
          </article>
        </div>
      </div>
    </section>
  )
}
