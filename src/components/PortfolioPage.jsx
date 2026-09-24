import React, { useState, useRef } from "react"
import { products } from "../data/products"
import ProductIcon from "./ProductIcon"

// Set true to force the "Our Products" section to render locally for
// review, even if no product has a url yet. Must be false in production.
const PREVIEW_ALL = false

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function PortfolioPage() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const itemRefs = useRef([])

  // The section only makes sense once there's at least one live product to
  // show — an all-"Coming soon" showcase isn't worth a whole page section.
  // Products without a url still render as "Coming soon" once the section
  // is visible (i.e. once at least one other product does have a url).
  const hasAnyProductUrl = products.some((p) => p.url && p.url.trim())
  const showProductsSection = hasAnyProductUrl || PREVIEW_ALL

  const selectedProduct = products[selectedIdx]
  const hasSelectedUrl = Boolean(selectedProduct.url && selectedProduct.url.trim())
  const displayUrl = hasSelectedUrl
    ? selectedProduct.url.replace(/^https?:\/\//, "")
    : `${selectedProduct.key}.evoletrix.com`

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
      {/* OUR PRODUCTS */}
      {showProductsSection && (
      <section className="section portfolio-page-section" aria-labelledby="productsTitle" style={{ paddingBlock: "96px 64px" }}>
        <div className="shell">
          <header className="ind-page-header" style={{ marginBottom: "56px" }}>
            <h2 id="productsTitle" className="display" style={{ marginBottom: "16px" }}>Our Products</h2>
            <p className="ind-page-sub">
              In-house software products we've built and maintain ourselves, separate from the client case studies below.
            </p>
          </header>

          <div className="product-switch-layout">
            <div className="product-switch-list" role="listbox" aria-label="Our products" onKeyDown={handleListKeyDown}>
              {products.map((prod, idx) => {
                const isSelected = idx === selectedIdx
                return (
                  <button
                    key={prod.key}
                    ref={(el) => { itemRefs.current[idx] = el }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    className={`product-switch-item ${isSelected ? "is-selected" : ""}`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <span className="mega-menu-tile" style={{ background: prod.accent }} aria-hidden="true">
                      <ProductIcon name={prod.icon} width={22} height={22} />
                    </span>
                    <span className="product-switch-item-text">
                      <span className="product-switch-item-name">{prod.name}</span>
                      <span className="product-switch-item-tagline">{prod.tagline}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="product-preview" key={selectedIdx}>
              <div className="browser-frame">
                <div className="browser-frame-bar">
                  <span className="browser-frame-dots" aria-hidden="true"><i></i><i></i><i></i></span>
                  <span className="browser-frame-url">{displayUrl}</span>
                </div>
                <div className="browser-frame-body">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={`${selectedProduct.name} screenshot`} className="browser-frame-image" />
                  ) : (
                    <div className="browser-frame-mockup" style={{ background: selectedProduct.accent }}>
                      <ProductIcon name={selectedProduct.icon} width={56} height={56} />
                    </div>
                  )}
                </div>
              </div>

              <div className="product-preview-info">
                <h3>{selectedProduct.name}</h3>
                <p className="product-preview-tagline">{selectedProduct.tagline}</p>

                <ul className="product-preview-features">
                  {selectedProduct.features.map((f, i) => (
                    <li key={i}><CheckIcon /> {f}</li>
                  ))}
                </ul>

                {selectedProduct.stack.length > 0 && (
                  <div className="product-preview-stack">
                    {selectedProduct.stack.map((s, i) => (
                      <span key={i} className="stack-chip">{s}</span>
                    ))}
                  </div>
                )}

                {hasSelectedUrl ? (
                  <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                    Visit live ↗
                  </a>
                ) : (
                  <button className="btn btn-solid" disabled>Coming soon</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Spacer transition: Dark to Light (Black to White) */}
      <div className="bg-transition-spacer" aria-hidden="true"></div>

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
