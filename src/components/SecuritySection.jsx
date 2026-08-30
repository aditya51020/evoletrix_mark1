import React, { useState } from "react"

export default function SecuritySection() {
  const [openIndex, setOpenIndex] = useState(0)

  const items = [
    {
      title: "IP & Code Ownership",
      body: "We sign comprehensive NDAs before any consultation. All source code, assets, and databases built during our contracts are 100% owned by the client."
    },
    {
      title: "Compliance Protocols",
      body: "Our developers build with strict security guidelines in mind, making your software ready for HIPAA, GDPR, or SOC 2 certifications."
    },
    {
      title: "VPC Cloud Hosting",
      body: "Deploy applications directly into your secure Virtual Private Cloud (AWS, Google Cloud, or Azure) to maintain full data residency control."
    },
    {
      title: "Data Encryption",
      body: "All database instances use AES-256 encryption at rest, and all communication uses TLS 1.3 to guarantee data privacy."
    }
  ]

  return (
    <section className="section security theme-light-block" id="trust" aria-labelledby="secTitle">
      <div className="shell">
        <span className="pill-tag reveal">◼ SAFETY &amp; TRUST</span>
        <h2 id="secTitle" className="display reveal">Protected at every layer<br />with enterprise security</h2>

        <div className="security-layout">
          <div className="security-visual reveal" data-grad="8" aria-hidden="true">
            <div className="sec-frame"></div>
          </div>

          <div className="security-accordion reveal" id="secAccordion">
            {items.map((item, idx) => (
              <details 
                key={idx} 
                className="acc-item" 
                open={openIndex === idx}
                onClick={(e) => {
                  e.preventDefault()
                  setOpenIndex(openIndex === idx ? -1 : idx)
                }}
              >
                <summary style={{ cursor: "pointer" }}>
                  <span>{item.title}</span>
                  <span className="acc-icon" aria-hidden="true"></span>
                </summary>
                <div className="acc-body">{item.body}</div>
              </details>
            ))}
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))} className="btn btn-outline-dark btn-sm sec-btn">Discuss your security requirements →</button>
          </div>
        </div>
      </div>
    </section>
  )
}
