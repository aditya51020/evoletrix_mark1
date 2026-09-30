import React, { useState, useRef, useEffect } from "react"
import { products } from "../data/products"
import AbstractBlueprint from "./AbstractBlueprint"

// Set true to force the "Our Products" section to render locally for
// review, even if no product has a url yet. Must be false in production.
const PREVIEW_ALL = false

export default function PortfolioPage() {
  // Lands on a specific product when arriving via a link like
  // /portfolio#compete (the header mega-menu's fallback for a product
  // with no live url yet) — otherwise defaults to the first product.
  const [selectedIdx, setSelectedIdx] = useState(() => {
    const key = window.location.hash.replace("#", "")
    const idx = products.findIndex((p) => p.key === key)
    return idx >= 0 ? idx : 0
  })
  const itemRefs = useRef([])
  const [gradNum, setGradNum] = useState(5)

  // Cycle the banner gradient (5, 6, 7) every 2 seconds — same treatment
  // as the About/Careers page hero banners.
  useEffect(() => {
    const interval = setInterval(() => {
      setGradNum((prev) => (prev === 7 ? 5 : prev + 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // The section only makes sense once there's at least one live product to
  // show — an all-"Coming soon" showcase isn't worth a whole page section.
  // Products without a url still render as "Coming soon" once the section
  // is visible (i.e. once at least one other product does have a url).
  const hasAnyProductUrl = products.some((p) => p.url && p.url.trim())
  const showProductsSection = hasAnyProductUrl || PREVIEW_ALL

  const selectedProduct = products[selectedIdx]
  const hasSelectedUrl = Boolean(selectedProduct.url && selectedProduct.url.trim())

  const handleListKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()
    const delta = e.key === "ArrowDown" ? 1 : -1
    const nextIdx = Math.min(products.length - 1, Math.max(0, selectedIdx + delta))
    setSelectedIdx(nextIdx)
    itemRefs.current[nextIdx]?.focus()
  }

  return (
    <>
      {/* OUR PRODUCTS — dark title strip keeps the transparent header
          legible at scroll-top, then the switcher itself is a light
          panel (feature-layout, the same pattern WhySection uses). */}
      {showProductsSection && (
      <>
      <section className="section portfolio-page-section" aria-labelledby="productsTitle" style={{ paddingBlock: "96px 64px" }}>
        <div className="shell">
          <header className="ind-page-header" style={{ marginBottom: "56px" }}>
            <h1 id="productsTitle" className="display" style={{ marginBottom: "16px" }}>Our Products</h1>
            <p className="ind-page-sub">
              In-house software products we've built and maintain ourselves, separate from the client case studies below.
            </p>
          </header>

          <div
            data-grad={gradNum}
            style={{
              height: "360px",
              border: "1px solid var(--line-soft)",
              borderRadius: "var(--radius)",
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              padding: "40px",
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.4)",
              overflow: "hidden",
              transition: "background 0.8s ease-in-out, background-image 0.8s ease-in-out"
            }}
            className="about-hero-banner"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.08,
                backgroundImage: "radial-gradient(var(--fg) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            ></div>
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="pill-tag" style={{ color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.2)", marginBottom: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <svg viewBox="0 0 24 24" width="6" height="6" fill="currentColor"><rect width="24" height="24"/></svg> PRODUCTS BY EVOLETRIX
              </span>
              <h2 style={{ color: "#ffffff", fontSize: "28px", fontWeight: "600", marginTop: "8px" }}>
                Software We Design, Build &amp; Ship Ourselves
              </h2>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-transition-spacer" aria-hidden="true"></div>

      <section className="section product-showcase theme-light-block" aria-label="Product details" style={{ paddingBlock: "40px 96px" }}>
        <div className="shell">
          <div className="feature-layout">
            <div className="feature-tabs" role="tablist" aria-label="Our products" onKeyDown={handleListKeyDown}>
              {products.map((prod, idx) => {
                const isSelected = idx === selectedIdx
                return (
                  <button
                    key={prod.key}
                    ref={(el) => { itemRefs.current[idx] = el }}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    className={`feature-tab ${isSelected ? "is-active" : ""}`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <span className="ft-num">{String(idx + 1).padStart(2, "0")}</span> {prod.name}
                  </button>
                )
              })}
            </div>

            <div className="feature-panels">
              <article className="feature-panel is-active" key={selectedIdx}>
                <div className="feature-visual">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={`${selectedProduct.name} screenshot`}
                      className="feature-visual-image"
                      loading="lazy"
                      decoding="async"
                      width="2400"
                      height="1500"
                    />
                  ) : (
                    <AbstractBlueprint color={selectedProduct.color} />
                  )}
                </div>
                <div className="feature-copy">
                  <span className="ft-index">{String(selectedIdx + 1).padStart(2, "0")}</span>
                  <h3>{selectedProduct.name}</h3>
                  <p>{selectedProduct.desc || selectedProduct.tagline}</p>
                  <ul className="ticks">
                    {selectedProduct.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  {selectedProduct.stack.length > 0 && (
                    <div className="product-preview-stack" style={{ marginTop: "16px" }}>
                      {selectedProduct.stack.map((s, i) => (
                        <span key={i} className="stack-chip">{s}</span>
                      ))}
                    </div>
                  )}
                  {hasSelectedUrl ? (
                    <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer" className="btn btn-dark product-showcase-cta">
                      Visit live ↗
                    </a>
                  ) : (
                    <button
                      className="btn btn-dark product-showcase-cta"
                      onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                    >
                      Book a demo
                    </button>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
      </>
      )}

      {/* Light CTA Section */}
      <section className="section outcomes theme-light-block" style={{ paddingBlock: "96px" }}>
        <div className="shell" style={{ textAlign: "center" }}>
          <h2 className="display" style={{ color: "var(--light-fg)", marginBottom: "16px" }}>Have a unique project in mind?</h2>
          <p style={{ color: "var(--fg-dim)", fontSize: "16px", maxWidth: "600px", margin: "0 auto 32px" }}>
            Let's discuss how we can build high-performance, secure cloud products for your target sectors.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
            className="btn btn-dark btn-lg"
          >
            Start a project →
          </button>
        </div>
      </section>

      {/* Spacer transition: Light to Dark (White to Black) */}
      <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>
    </>
  )
}
