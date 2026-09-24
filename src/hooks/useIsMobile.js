import { useState, useEffect } from "react"

// Matches the site's existing 860px mobile breakpoint (see style.css).
// Initial state is computed synchronously from matchMedia (same check the
// effect uses) so consumers that don't render at all on mobile — e.g.
// BentoShowcase — never flash their desktop content on first paint before
// flipping to mobile.
export default function useIsMobile(breakpoint = 860) {
  const query = `(max-width: ${breakpoint}px)`
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handleChange = () => setIsMobile(mql.matches)
    handleChange()
    mql.addEventListener("change", handleChange)
    return () => mql.removeEventListener("change", handleChange)
  }, [breakpoint, query])

  return isMobile
}
