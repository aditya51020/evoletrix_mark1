import React, { useState, useEffect } from "react"

export default function Header() {
  const [isStuck, setIsStuck] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 12)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`site-header ${isStuck ? "is-stuck" : ""}`} id="siteHeader">
      <div className="shell header-inner">
        <a href="#top" className="brand" aria-label="Evoletrix home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
              <path d="M4 7 12 3l8 4v10l-8 4-8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="brand-name">Evoletrix</span>
        </a>

        <nav className="primary-nav" aria-label="Primary">
          <a href="#services-page">Services</a>
          <a href="#industries-page">Industries</a>
          <a href="#portfolio-page">Portfolio</a>
          <a href="#about-page">About Us</a>
          <a href="#careers-page">Careers</a>
        </nav>

        <div className="header-cta">
          <button onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))} className="btn btn-solid">Get in touch</button>
        </div>

        <button 
          className="nav-toggle" 
          id="navToggle" 
          aria-label="Toggle menu" 
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className="mobile-menu" id="mobileMenu" style={{ display: isMenuOpen ? "flex" : "none" }}>
        <a href="#services-page" onClick={() => setIsMenuOpen(false)}>Services</a>
        <a href="#industries-page" onClick={() => setIsMenuOpen(false)}>Industries</a>
        <a href="#portfolio-page" onClick={() => setIsMenuOpen(false)}>Portfolio</a>
        <a href="#about-page" onClick={() => setIsMenuOpen(false)}>About Us</a>
        <a href="#careers-page" onClick={() => setIsMenuOpen(false)}>Careers</a>
        <button className="btn btn-solid" onClick={() => { setIsMenuOpen(false); window.dispatchEvent(new CustomEvent("open-booking")); }}>Get in touch</button>
      </div>
    </header>
  )
}
