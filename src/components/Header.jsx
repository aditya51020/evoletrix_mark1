import React, { useState, useEffect, useRef } from "react"
import { products } from "../data/products"
import ProductIcon from "./ProductIcon"

const OPEN_DELAY = 100
const CLOSE_DELAY = 200

export default function Header() {
  const [isStuck, setIsStuck] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false)
  const [isMobilePortfolioOpen, setIsMobilePortfolioOpen] = useState(false)

  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const openTimerRef = useRef(null)
  const closeTimerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 12)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const clearPortfolioTimers = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }

  const openPortfolioMenu = (immediate = false) => {
    clearPortfolioTimers()
    if (immediate) {
      setIsPortfolioOpen(true)
      return
    }
    openTimerRef.current = setTimeout(() => setIsPortfolioOpen(true), OPEN_DELAY)
  }

  const closePortfolioMenu = (immediate = false) => {
    clearPortfolioTimers()
    if (immediate) {
      setIsPortfolioOpen(false)
      return
    }
    closeTimerRef.current = setTimeout(() => setIsPortfolioOpen(false), CLOSE_DELAY)
  }

  // Cleanup any pending open/close timers on unmount.
  useEffect(() => clearPortfolioTimers, [])

  // Esc closes and returns focus to the trigger; outside click closes.
  useEffect(() => {
    if (!isPortfolioOpen) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closePortfolioMenu(true)
        triggerRef.current?.focus()
      }
    }
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        panelRef.current && !panelRef.current.contains(e.target)
      ) {
        closePortfolioMenu(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPortfolioOpen])

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

          <div
            className="mega-menu-wrapper"
            onMouseEnter={() => openPortfolioMenu()}
            onMouseLeave={() => closePortfolioMenu()}
          >
            <button
              ref={triggerRef}
              type="button"
              className={`mega-menu-trigger ${isPortfolioOpen ? "is-active" : ""}`}
              aria-expanded={isPortfolioOpen}
              aria-controls="portfolio-mega-menu"
              onClick={() => {
                // Click/Enter only ever opens. Closing is Esc, outside
                // click, or mouse-leave — never a second click/Enter here,
                // since the panel may already be open from hover.
                if (!isPortfolioOpen) openPortfolioMenu(true)
              }}
            >
              Portfolio
              <svg className={`mega-menu-chevron ${isPortfolioOpen ? "is-open" : ""}`} viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {isPortfolioOpen && (
              <div
                id="portfolio-mega-menu"
                ref={panelRef}
                className="mega-menu-panel"
                role="menu"
                aria-label="Portfolio"
                onMouseEnter={() => openPortfolioMenu(true)}
                onMouseLeave={() => closePortfolioMenu()}
              >
                <div className="shell mega-menu-inner">
                  <div className="mega-menu-left">
                    <div className="mega-menu-grid">
                      {products.map((prod) => {
                        const hasUrl = Boolean(prod.url && prod.url.trim())
                        const ItemTag = hasUrl ? "a" : "div"
                        const itemProps = hasUrl
                          ? { href: prod.url, target: "_blank", rel: "noopener noreferrer", role: "menuitem" }
                          : { role: "menuitem", "aria-disabled": true }
                        return (
                          <ItemTag
                            key={prod.key}
                            className={`mega-menu-item ${hasUrl ? "" : "mega-menu-item--soon"}`}
                            {...itemProps}
                          >
                            <span className="mega-menu-tile" style={{ background: prod.accent }} aria-hidden="true">
                              <ProductIcon name={prod.icon} width={22} height={22} />
                            </span>
                            <span className="mega-menu-item-text">
                              <span className="mega-menu-item-name">
                                {prod.name}
                                {hasUrl && <span className="mega-menu-item-external" aria-hidden="true">↗</span>}
                              </span>
                              <span className="mega-menu-item-tagline">{prod.tagline}</span>
                              {!hasUrl && <span className="mega-menu-item-badge">Coming soon</span>}
                            </span>
                          </ItemTag>
                        )
                      })}
                    </div>
                    <a href="#portfolio-page" className="mega-menu-view-all" onClick={() => closePortfolioMenu(true)}>
                      View full portfolio →
                    </a>
                  </div>

                  <div className="mega-menu-right">
                    <h4>Have a product idea?</h4>
                    <p>Tell us what you're building and we'll help you scope it, design it, and ship it.</p>
                    <button
                      type="button"
                      className="btn btn-solid"
                      onClick={() => {
                        closePortfolioMenu(true)
                        window.dispatchEvent(new CustomEvent("open-booking"))
                      }}
                    >
                      Book a free consultation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

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

        <div className="mobile-portfolio-accordion">
          <button
            type="button"
            className="mobile-portfolio-toggle"
            aria-expanded={isMobilePortfolioOpen}
            onClick={() => setIsMobilePortfolioOpen((prev) => !prev)}
          >
            Portfolio
            <svg className={`mega-menu-chevron ${isMobilePortfolioOpen ? "is-open" : ""}`} viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {isMobilePortfolioOpen && (
            <div className="mobile-portfolio-list">
              {products.map((prod) => {
                const hasUrl = Boolean(prod.url && prod.url.trim())
                const ItemTag = hasUrl ? "a" : "div"
                const itemProps = hasUrl
                  ? { href: prod.url, target: "_blank", rel: "noopener noreferrer", onClick: () => setIsMenuOpen(false) }
                  : {}
                return (
                  <ItemTag
                    key={prod.key}
                    className={`mobile-portfolio-item ${hasUrl ? "" : "mobile-portfolio-item--soon"}`}
                    {...itemProps}
                  >
                    <span className="mega-menu-tile mega-menu-tile--sm" style={{ background: prod.accent }} aria-hidden="true">
                      <ProductIcon name={prod.icon} width={16} height={16} />
                    </span>
                    <span>{prod.name}</span>
                    {!hasUrl && <span className="mega-menu-item-badge">Coming soon</span>}
                  </ItemTag>
                )
              })}
              <a href="#portfolio-page" className="mobile-portfolio-viewall" onClick={() => setIsMenuOpen(false)}>
                View full portfolio →
              </a>
            </div>
          )}
        </div>

        <a href="#about-page" onClick={() => setIsMenuOpen(false)}>About Us</a>
        <a href="#careers-page" onClick={() => setIsMenuOpen(false)}>Careers</a>
        <button className="btn btn-solid" onClick={() => { setIsMenuOpen(false); window.dispatchEvent(new CustomEvent("open-booking")); }}>Get in touch</button>
      </div>
    </header>
  )
}
