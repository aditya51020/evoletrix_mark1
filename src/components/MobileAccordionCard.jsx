import React, { useRef } from "react"

// Generic inline accordion: a trigger button followed by a smoothly
// height-animated panel directly beneath it (CSS grid-template-rows
// 0fr->1fr trick, no JS height measurement needed). Used by both
// ServicesPage.jsx and IndustriesPage.jsx for the mobile card layout.
export default function MobileAccordionCard({ id, isOpen, onToggle, triggerClassName, triggerContent, panelContent }) {
  const cardRef = useRef(null)

  const handleToggle = () => {
    const willOpen = !isOpen
    onToggle()
    if (willOpen) {
      requestAnimationFrame(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        cardRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" })
      })
    }
  }

  return (
    <div ref={cardRef} className="mobile-accordion-card">
      <button
        type="button"
        id={`${id}-trigger`}
        className={triggerClassName}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={handleToggle}
      >
        {triggerContent}
      </button>
      <div className={`mobile-accordion-panel-wrapper ${isOpen ? "is-open" : ""}`}>
        <div
          id={`${id}-panel`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          className="mobile-accordion-panel-inner"
        >
          {panelContent}
        </div>
      </div>
    </div>
  )
}
