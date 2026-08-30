import React, { useState, useEffect, useRef } from "react"

function StatItem({ count, suffix, decimals = 0, label }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let active = true
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && active) {
        let start = 0
        const end = parseFloat(count)
        const duration = 1200 // ms
        const startTime = performance.now()

        const animate = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const ease = progress * (2 - progress) // ease out
          const value = start + (end - start) * ease
          
          setCurrent(value)

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            setCurrent(end)
          }
        }
        requestAnimationFrame(animate)
        observer.disconnect()
      }
    }, { threshold: 0.1 })

    if (ref.current) observer.observe(ref.current)

    return () => {
      active = false
      observer.disconnect()
    }
  }, [count])

  return (
    <div className="stat reveal" ref={ref}>
      <span className="stat-num">
        {current.toFixed(decimals)}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="section stats theme-light-block" id="enterprise" aria-labelledby="statsTitle">
      <div className="shell">
        <span className="pill-tag reveal">◼ BUSINESS METRICS</span>
        <h2 id="statsTitle" className="display reveal">Built for scale, engineered for reliability</h2>
        <div className="stats-grid">
          <StatItem count={50} suffix="+" label="Custom systems delivered" />
          <StatItem count={98} suffix="%" label="Client retention rate" />
          <StatItem count={95} suffix="%" label="Test code coverage" />
          <StatItem count={100} suffix="%" label="Client IP ownership" />
        </div>
      </div>
    </section>
  )
}


