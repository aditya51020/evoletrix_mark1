import React from "react"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
              <path d="M4 7 12 3l8 4v10l-8 4-8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        <nav className="footer-col" aria-label="Services">
          <h4>Services</h4>
          <a href="#services-page">Web applications</a>
          <a href="#services-page">Native iOS apps</a>
          <a href="#services-page">AI &amp; LLM systems</a>
          <a href="#services-page">Blockchain platforms</a>
          <a href="#services-page">Custom ERP software</a>
        </nav>
        <nav className="footer-col" aria-label="Industries">
          <h4>Industries</h4>
          <a href="#industries">Healthcare</a>
          <a href="#industries">Education LMS</a>
          <a href="#industries">Enterprise ERP</a>
          <a href="#industries">Spatial &amp; GIS</a>
        </nav>
        <nav className="footer-col" aria-label="Company">
          <h4>Company</h4>
          <a href="#industries">Why Evoletrix</a>
          <a href="#tech-stack">Tech stack</a>
          <a href="#trust">Security &amp; Trust</a>
          <a href="#faq">FAQs</a>
        </nav>
        <nav className="footer-col" aria-label="Registered Office">
          <h4>Registered Office</h4>
          <a href="#top">Faridabad</a>
          <a href="#top">Haryana, India</a>
          <a href="#top">Active Pvt. Ltd.</a>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <div className="footer-social" aria-label="Social links">
          <a href="https://www.linkedin.com/company/evoletrix-private-limited/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
        </div>
        <p className="footer-copy">© 2026 Evoletrix Private Limited. All rights reserved.</p>
      </div>
    </footer>
  )
}
