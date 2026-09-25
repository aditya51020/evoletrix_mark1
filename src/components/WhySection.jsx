import React, { useState, useRef, useEffect } from "react"
import useIsMobile from "../hooks/useIsMobile"

export default function WhySection() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState(0) // desktop tabs only

  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const [activeDot, setActiveDot] = useState(0) // mobile carousel only

  const tabs = [
    { num: "01", name: "PRODUCT ENG." },
    { num: "02", name: "DATA CENTER" },
    { num: "03", name: "IT OUTSOURCING" },
    { num: "04", name: "DIGITAL TRANS." },
    { num: "05", name: "DATA SERVICES" }
  ]

  // Shared content for both the desktop tab panels and the mobile
  // carousel cards, so the two layouts never drift out of sync.
  const panels = [
    {
      visual: (
        <div className="feature-visual" data-grad="1">
          <div className="visual-search">⌕ product engineering… <span>Design · Dev · QA</span></div>
        </div>
      ),
      copy: (
        <div className="feature-copy">
          <span className="ft-index">01</span>
          <h3>Product Development &amp; Engineering</h3>
          <p>We build robust, clean, and highly scalable software solutions tailored to fit your unique requirements.</p>
          <ul className="ticks">
            <li>Product Design</li>
            <li>Application Development</li>
            <li>Software Development</li>
            <li>QA and Testing</li>
            <li>DevOps</li>
            <li>Product Management</li>
          </ul>
        </div>
      )
    },
    {
      visual: (
        <div className="feature-visual" data-grad="1">
          <div className="visual-terminal">
            <span className="vt-head">DATA CENTER FABRIC <em>● provisioning</em></span>
          </div>
        </div>
      ),
      copy: (
        <div className="feature-copy">
          <span className="ft-index">02</span>
          <h3>Data Center Services</h3>
          <p>We design, build, and operate enterprise data centers from the ground up, covering network fabric, high-speed interconnects, and day-to-day operations for mission-critical infrastructure.</p>
          <ul className="ticks">
            <li>Build, Implementation &amp; Operations</li>
            <li>Greenfield Design — Built From the Ground Up</li>
            <li>VxLAN Network Fabric</li>
            <li>InfiniBand High-Speed Interconnects</li>
            <li>SD-WAN &amp; Firewall Deployment</li>
            <li>Network Automation</li>
          </ul>
        </div>
      )
    },
    {
      visual: (
        <div className="feature-visual" data-grad="2">
          <div className="visual-block"></div>
        </div>
      ),
      copy: (
        <div className="feature-copy">
          <span className="ft-index">03</span>
          <h3>IT Managed &amp; Outsourcing</h3>
          <p>Ensure business continuity, secure storage, and top-tier compliance protocols for all your systems.</p>
          <ul className="ticks">
            <li>Managed IT Services</li>
            <li>IT Audit Services</li>
            <li>IT Outsourcing</li>
          </ul>
        </div>
      )
    },
    {
      visual: (
        <div className="feature-visual" data-grad="3">
          <div className="visual-terminal">
            <span className="vt-head">LEGACY MODERNIZATION <em>● modernizing</em></span>
          </div>
        </div>
      ),
      copy: (
        <div className="feature-copy">
          <span className="ft-index">04</span>
          <h3>Digital Transformation</h3>
          <p>Upgrade outdated workflows into cloud-native architectures that utilize the power of blockchain, AI, and IoT.</p>
          <ul className="ticks">
            <li>Legacy Application Modernization</li>
            <li>Blockchain</li>
            <li>Cloud</li>
            <li>Cybersecurity</li>
            <li>IoT</li>
            <li>AR/VR</li>
          </ul>
        </div>
      )
    },
    {
      visual: (
        <div className="feature-visual" data-grad="4">
          <div className="visual-terminal">
            <span className="vt-head">DATA ANALYTICS <em>big_data · py 3.11</em></span>
            <pre className="code code--sm"><span className="c-var">data</span> = load_dataset(<span className="c-str">'logs.csv'</span>)
<span className="c-var">metrics</span> = calculate_analytics(data)
<span className="c-fn">render_dashboard</span>(metrics)</pre>
          </div>
        </div>
      ),
      copy: (
        <div className="feature-copy">
          <span className="ft-index">05</span>
          <h3>Data Services</h3>
          <p>Transform large raw datasets into actionable dashboard metrics and business analytics with ease.</p>
          <ul className="ticks">
            <li>Big Data</li>
            <li>Data Analytics</li>
          </ul>
        </div>
      )
    }
  ]

  // Track which carousel card is in view as the user swipes, so the dot
  // indicators follow scroll position (not just dot taps).
  useEffect(() => {
    if (!isMobile) return
    const track = trackRef.current
    if (!track) return

    const observer = new IntersectionObserver(
      (entries) => {
        let best = null
        for (const entry of entries) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
            best = entry
          }
        }
        if (best) {
          const idx = cardRefs.current.indexOf(best.target)
          if (idx !== -1) setActiveDot(idx)
        }
      },
      { root: track, threshold: [0.5, 0.75, 1] }
    )

    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [isMobile])

  const scrollToCard = (idx) => {
    const el = cardRefs.current[idx]
    if (!el) return
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", inline: "start", block: "nearest" })
  }

  return (
    <section className="section why theme-light-block" id="industries" aria-labelledby="whyTitle">
      <div className="shell">
        <span className="pill-tag reveal">◼ OUR SERVICES</span>
        <h2 id="whyTitle" className="display reveal">
          Services We Offer
        </h2>

        {isMobile ? (
          /* Mobile: native scroll-snap swipe carousel, no library. */
          <div className="services-carousel">
            <div className="services-carousel-track" ref={trackRef}>
              {panels.map((panel, idx) => (
                <div
                  key={idx}
                  className="services-carousel-card"
                  ref={(el) => { cardRefs.current[idx] = el }}
                >
                  {panel.visual}
                  {panel.copy}
                </div>
              ))}
            </div>
            <div className="services-carousel-dots" role="tablist" aria-label="Services">
              {panels.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={activeDot === idx}
                  aria-label={`Go to ${tabs[idx].name.toLowerCase()}`}
                  className={`carousel-dot ${activeDot === idx ? "is-active" : ""}`}
                  onClick={() => scrollToCard(idx)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="feature-layout">
            <div className="feature-tabs" role="tablist" aria-label="Capabilities">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  className={`feature-tab ${activeTab === idx ? "is-active" : ""}`}
                  role="tab"
                  aria-selected={activeTab === idx}
                  onClick={() => setActiveTab(idx)}
                >
                  <span className="ft-num">{tab.num}</span> {tab.name}
                </button>
              ))}
            </div>

            <div className="feature-panels">
              {panels.map((panel, idx) => (
                <article key={idx} className={`feature-panel ${activeTab === idx ? "is-active" : ""}`}>
                  {panel.visual}
                  {panel.copy}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
