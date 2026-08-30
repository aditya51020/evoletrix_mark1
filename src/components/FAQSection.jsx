import React, { useState } from "react"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(-1)

  const faqs = [
    {
      q: "What is Evoletrix's development process?",
      a: "We use an agile, milestone-driven process. It begins with comprehensive discovery and wireframing, followed by iterative development sprints, rigorous QA audits, and finally deployment and post-launch support."
    },
    {
      q: "Do you sign Non-Disclosure Agreements (NDAs)?",
      a: "Yes, absolutely. We sign comprehensive NDAs before discussing any project details to guarantee your intellectual property and product concepts remain 100% confidential."
    },
    {
      q: "Who owns the source code and assets built?",
      a: "You do. Under our contracts, our clients receive 100% ownership of the custom codebases, UI/UX designs, database architectures, and deployments we engineer."
    },
    {
      q: "What technologies do you specialize in?",
      a: "We specialize in modern frontend stacks (React, Next.js, Vue), mobile systems (Swift/iOS, Kotlin), scalable backends (FastAPI, Node.js, Go), custom blockchain contracts (Solidity, Rust), and GIS/georeferencing mapping tools."
    },
    {
      q: "How do we get started and get a project estimate?",
      a: "Simply use our contact form below or email us to schedule a brief introductory call. We will review your product requirements and provide a detailed roadmap and estimate."
    }
  ]

  return (
    <section className="section faq theme-light-block" id="faq" aria-labelledby="faqTitle">
      <div className="shell">
        <span className="pill-tag reveal">◼ FAQ</span>
        <h2 id="faqTitle" className="display reveal">Frequently asked questions</h2>
        <div className="faq-list reveal" id="faqList">
          {faqs.map((faq, idx) => (
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
                <span>{faq.q}</span>
                <span className="acc-icon" aria-hidden="true"></span>
              </summary>
              <div className="acc-body">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
