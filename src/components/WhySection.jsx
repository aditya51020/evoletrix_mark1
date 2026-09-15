import React, { useState } from "react"

export default function WhySection() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { num: "01", name: "PRODUCT ENG." },
    { num: "02", name: "IT OUTSOURCING" },
    { num: "03", name: "DIGITAL TRANS." },
    { num: "04", name: "CONSULTING" },
    { num: "05", name: "DATA SERVICES" }
  ]

  return (
    <section className="section why theme-light-block" id="industries" aria-labelledby="whyTitle">
      <div className="shell">
        <span className="pill-tag reveal">◼ OUR SERVICES</span>
        <h2 id="whyTitle" className="display reveal">
          Services We Offer
        </h2>

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
            {/* Panel 1: Product Development & Engineering */}
            <article className={`feature-panel ${activeTab === 0 ? "is-active" : ""}`}>
              <div className="feature-visual" data-grad="1">
                <div className="visual-search">⌕ product engineering… <span>Design · Dev · QA</span></div>
              </div>
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
            </article>

            {/* Panel 2: IT Managed & Outsourcing */}
            <article className={`feature-panel ${activeTab === 1 ? "is-active" : ""}`}>
              <div className="feature-visual" data-grad="2">
                <div className="visual-block"></div>
              </div>
              <div className="feature-copy">
                <span className="ft-index">02</span>
                <h3>IT Managed &amp; Outsourcing</h3>
                <p>Ensure business continuity, secure storage, and top-tier compliance protocols for all your systems.</p>
                <ul className="ticks">
                  <li>Managed IT Services</li>
                  <li>IT Audit Services</li>
                  <li>IT Outsourcing</li>
                </ul>
              </div>
            </article>

            {/* Panel 3: Digital Transformation */}
            <article className={`feature-panel ${activeTab === 2 ? "is-active" : ""}`}>
              <div className="feature-visual" data-grad="3">
                <div className="visual-terminal">
                  <span className="vt-head">LEGACY MODERNIZATION <em>● modernizing</em></span>
                </div>
              </div>
              <div className="feature-copy">
                <span className="ft-index">03</span>
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
            </article>

            {/* Panel 4: Consulting Services */}
            <article className={`feature-panel ${activeTab === 3 ? "is-active" : ""}`}>
              <div className="feature-visual" data-grad="1">
                <div className="visual-search">⌕ consulting… <span>IT · Software · FinTech</span></div>
              </div>
              <div className="feature-copy">
                <span className="ft-index">04</span>
                <h3>Consulting Services</h3>
                <p>Receive strategic roadmap directions, architectural planning, and technology evaluations from experts.</p>
                <ul className="ticks">
                  <li>IT Consulting</li>
                  <li>Software Consulting</li>
                  <li>FinTech Consulting</li>
                  <li>Mobile Consulting</li>
                </ul>
              </div>
            </article>

            {/* Panel 5: Data Services */}
            <article className={`feature-panel ${activeTab === 4 ? "is-active" : ""}`}>
              <div className="feature-visual" data-grad="4">
                <div className="visual-terminal visual-terminal--data">
                  <span className="vt-head">DATA ANALYTICS <em>big_data · py 3.11</em></span>
                  <pre className="code code--sm"><span className="c-var">data</span> = load_dataset(<span className="c-str">'logs.csv'</span>)
<span className="c-var">metrics</span> = calculate_analytics(data)
<span className="c-fn">render_dashboard</span>(metrics)</pre>
                </div>
              </div>
              <div className="feature-copy">
                <span className="ft-index">05</span>
                <h3>Data Services</h3>
                <p>Transform large raw datasets into actionable dashboard metrics and business analytics with ease.</p>
                <ul className="ticks">
                  <li>Big Data</li>
                  <li>Data Analytics</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
