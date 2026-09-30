import React from "react"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <img src="/logo-icon-white.png" alt="Evoletrix" className="footer-brand-icon" />
        </div>
        <nav className="footer-col" aria-label="Services">
          <h4>Services</h4>
          <a href="/services">Web applications</a>
          <a href="/services">Native iOS apps</a>
          <a href="/services">AI &amp; LLM systems</a>
          <a href="/services">Blockchain platforms</a>
          <a href="/services">Custom ERP software</a>
        </nav>
        <nav className="footer-col" aria-label="Industries">
          <h4>Industries</h4>
          <a href="/industries">Healthcare</a>
          <a href="/industries">Education LMS</a>
          <a href="/industries">Enterprise ERP</a>
          <a href="/industries">Spatial &amp; GIS</a>
        </nav>
        <nav className="footer-col" aria-label="Company">
          <h4>Company</h4>
          <a href="/about">Why Evoletrix</a>
          <a href="/#tech-stack">Tech stack</a>
          <a href="/#trust">Security &amp; Trust</a>
          <a href="/#faq">FAQs</a>
        </nav>
        <nav className="footer-col" aria-label="Registered Office">
          <h4>Registered Office</h4>
          <a href="/">Faridabad</a>
          <a href="/">Haryana, India</a>
          <a href="/">Active Pvt. Ltd.</a>
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
