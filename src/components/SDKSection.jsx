import React from "react"

export default function SDKSection() {
  return (
    <section className="section sdk theme-light-block" id="engagement-models" aria-labelledby="sdkTitle">
      <div className="shell">
        <span className="pill-tag reveal">◼ COLLABORATION</span>
        <h2 id="sdkTitle" className="pixel-title reveal">ENGAGEMENT MODELS</h2>

        <div className="sdk-cards reveal">
          <article className="sdk-card">
            <h3>Dedicated Engineering Squad</h3>
            <p>Hire a full-time, dedicated team of developers, designers, and a product manager. We integrate into your Slack and sprint cycles, working as an extension of your company.</p>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))} className="btn btn-dark btn-sm">Get started</button>
            <div className="sdk-visual" data-grad="5"><span className="glyph">✦</span></div>
          </article>
          <article className="sdk-card">
            <h3>Milestone-Driven Projects</h3>
            <p>Perfect for building MVPs or defined features. We collaborate to write detailed specifications, agree on milestones, and deliver on a fixed timeline and budget.</p>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))} className="btn btn-dark btn-sm">Get started</button>
            <div className="sdk-visual" data-grad="6"><span className="glyph">◆</span></div>
          </article>
        </div>

        <div className="sdk-split reveal">
          <div className="sdk-split-col">
            <div className="code-window">
              <div className="cw-head"><span className="cw-dots"><i></i><i></i><i></i></span><span className="cw-file">Slack #evoletrix-squad</span></div>
              <pre className="code" style={{ padding: "14px", whiteSpace: "normal", fontSize: "12px", lineHeight: "1.4" }}>
                <strong>Client:</strong> How is the iOS map integration coming along?<br />
                <strong>PM:</strong> Just pushed the latest build to TestFlight. Check it out!<br />
                <strong>Dev:</strong> Added the cache layer, map load time is now under 150ms. [Active]
              </pre>
            </div>
            <p className="sdk-note">Enjoy transparent, daily communication. We share progress on Slack and commit code directly to your GitHub repository.</p>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))} className="btn btn-outline-dark btn-sm">Learn more</button>
          </div>
          <div className="sdk-split-col">
            <div className="model-swap" data-grad="7" aria-hidden="true" style={{ fontSize: "28px", display: "grid", placeItems: "center" }}>◷</div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "16px 0 8px" }}>Hourly Consulting &amp; Audits</h3>
            <p className="sdk-note" style={{ marginTop: "0" }}>Need an expert to audit your database queries, review security compliance, or plan cloud infrastructure? Engage our senior architects on a flexible hourly consulting basis.</p>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))} className="btn btn-outline-dark btn-sm">Learn more</button>
          </div>
        </div>
      </div>
    </section>
  )
}
