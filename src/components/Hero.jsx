import React, { useRef, useEffect } from "react"

export default function Hero() {
  const canvasRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const heroSection = heroRef.current

    if (!canvas || !heroSection) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const highlightDuration = 1400
    const dotSpacing = 11
    const frameInterval = 1000 / 30 // the animation only needs ~30fps; halves the CPU/GPU cost for no visible loss
    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let dots = []
    let raf = 0
    let hoveredDot = null
    let lastFrameTime = 0
    let isTabVisible = document.visibilityState === "visible"
    let isHeroInView = true

    const highlightDotAt = (e) => {
      const rect = canvas.getBoundingClientRect()
      const pointerX = e.clientX - rect.left
      const pointerY = e.clientY - rect.top
      let closestDot = null
      let closestDistance = 14

      for (const dot of dots) {
        const distance = Math.hypot(pointerX - dot.x, pointerY - dot.y)
        if (distance < closestDistance) {
          closestDot = dot
          closestDistance = distance
        }
      }

      if (closestDot && closestDot !== hoveredDot) {
        closestDot.highlightStartedAt = performance.now()
        hoveredDot = closestDot
      } else if (!closestDot) {
        hoveredDot = null
      }
    }

    const handlePointerLeave = () => {
      hoveredDot = null
    }

    heroSection.addEventListener("pointermove", highlightDotAt, { passive: true })
    heroSection.addEventListener("pointerleave", handlePointerLeave)

    const buildDots = () => {
      dots = []
      const leftWidthBound = width * 0.5
      const rightWidthBound = width * 0.5
      const colsLeft = Math.floor(leftWidthBound / dotSpacing)
      const colsRightStart = Math.floor(rightWidthBound / dotSpacing)
      const colsRightEnd = Math.floor(width / dotSpacing)
      const rows = Math.floor(height / dotSpacing)

      const addClusterDots = (startColumn, endColumn, cluster) => {
        const activeCells = new Set()

        for (let row = 3; row < rows - 2; row++) {
          const rowAnimation = {
            stepDuration: 5000 + Math.random() * 4000,
            stepDelay: Math.random() * 5,
            stepPhase: Math.floor(Math.random() * 3),
            ledDuration: 4200 + Math.random() * 3200,
            ledDelay: Math.random() * 12
          }
          const yProgress = row / rows
          const bandDensity = 0.025
            + Math.exp(-((yProgress - 0.12) ** 2) / 0.004) * 0.46
            + Math.exp(-((yProgress - 0.35) ** 2) / 0.004) * 0.62
            + Math.exp(-((yProgress - 0.58) ** 2) / 0.004) * 0.62
            + Math.exp(-((yProgress - 0.81) ** 2) / 0.004) * 0.46
          const inwardReach = Math.min(0.94,
            0.22
            + Math.exp(-((yProgress - 0.47) ** 2) / 0.04) * 0.72
            + Math.exp(-((yProgress - 0.12) ** 2) / 0.01) * 0.18
            + Math.exp(-((yProgress - 0.81) ** 2) / 0.01) * 0.18
          )
          const verticalFade = Math.min(1, yProgress / 0.18, (1 - yProgress) / 0.18)

          for (let column = startColumn; column < endColumn; column++) {
            const baseX = column * dotSpacing
            const inwardProgress = cluster === 'left'
              ? baseX / leftWidthBound
              : (width - baseX) / (width - rightWidthBound)
            if (inwardProgress > inwardReach) continue
            const density = bandDensity * (1 - inwardProgress * 0.58)
            const hasActiveNeighbour = [
              `${row}:${column - 1}`,
              `${row - 1}:${column - 1}`,
              `${row - 1}:${column}`,
              `${row - 1}:${column + 1}`
            ].some((key) => activeCells.has(key))
            const activationChance = density * (hasActiveNeighbour ? 0.9 : 0.34)

            if (Math.random() > activationChance) continue

            activeCells.add(`${row}:${column}`)

            dots.push({
              x: baseX,
              y: row * dotSpacing,
              baseX,
              baseY: row * dotSpacing,
              column,
              rowAnimation,
              size: 8,
              cluster,
              highlightStartedAt: 0,
              baseAlpha: (0.28 + Math.random() * 0.16) * (1 - inwardProgress * 0.25) * verticalFade
            })
          }
        }
      }

      addClusterDots(1, colsLeft, 'left')
      addClusterDots(colsRightStart, colsRightEnd, 'right')
    }

    const render = (now) => {
      ctx.clearRect(0, 0, width, height)

      for (const d of dots) {
        const movementStep = Math.floor(now / d.rowAnimation.stepDuration + d.rowAnimation.stepDelay)
        const gridOffset = Math.round(Math.sin((movementStep + d.rowAnimation.stepPhase) * Math.PI / 2))
        const direction = d.cluster === 'left' ? 1 : -1
        d.x = d.baseX + gridOffset * dotSpacing * direction

        const ledStep = Math.floor(now / d.rowAnimation.ledDuration + d.rowAnimation.ledDelay)
        const isLedLit = (d.column + ledStep) % 13 === 0

        const highlightProgress = d.highlightStartedAt
          ? Math.max(0, 1 - (now - d.highlightStartedAt) / highlightDuration)
          : 0
        const normal = [113, 139, 183]
        const hover = [176, 198, 229]

        ctx.globalAlpha = Math.min(1, d.baseAlpha + (isLedLit ? 0.18 : 0) + (0.9 - d.baseAlpha) * highlightProgress)
        ctx.fillStyle = `rgb(${normal[0] + (hover[0] - normal[0]) * highlightProgress}, ${normal[1] + (hover[1] - normal[1]) * highlightProgress}, ${normal[2] + (hover[2] - normal[2]) * highlightProgress})`

        const dotX = d.x - d.size / 2
        const dotY = d.y - d.size / 2
        ctx.beginPath()
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(dotX, dotY, d.size, d.size, 2)
          ctx.fill()
        } else {
          ctx.fillRect(dotX, dotY, d.size, d.size)
        }
      }

      ctx.globalAlpha = 1
    }

    // Only keep animating while it's actually visible: on screen and the tab
    // is focused. Otherwise the loop is stopped entirely instead of ticking
    // (and burning CPU/battery) in the background. This is a slow, subtle
    // ambient background effect (not fast/flashing motion), so it isn't
    // gated behind prefers-reduced-motion the way a parallax or autoplaying
    // video would be.
    const shouldAnimate = () => isTabVisible && isHeroInView

    const draw = (now) => {
      if (!shouldAnimate()) {
        raf = 0
        return
      }
      if (now - lastFrameTime >= frameInterval) {
        lastFrameTime = now
        render(now)
      }
      raf = requestAnimationFrame(draw)
    }

    const startLoop = () => {
      if (raf || !shouldAnimate()) return
      raf = requestAnimationFrame(draw)
    }

    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible"
      if (isTabVisible) startLoop()
      else stopLoop()
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    const heroVisibilityObserver = new IntersectionObserver(([entry]) => {
      isHeroInView = entry.isIntersecting
      if (isHeroInView) startLoop()
      else stopLoop()
    })
    heroVisibilityObserver.observe(heroSection)

    // ResizeObserver tracks sizing changes dynamically, preventing initial 0-dimension bugs.
    // Rebuilding the dot grid is the most expensive step, so it's debounced —
    // mobile browsers fire several resize events in a row (e.g. the URL bar
    // showing/hiding) and rebuilding on every one of them causes visible jank.
    let resizeDebounce = 0
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeDebounce)
      resizeDebounce = setTimeout(() => {
        const entryWidth = heroSection.clientWidth
        const entryHeight = heroSection.clientHeight
        if (entryWidth > 0 && entryHeight > 0) {
          width = entryWidth
          height = entryHeight
          canvas.width = width * dpr
          canvas.height = height * dpr
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          buildDots()
          render(performance.now())
        }
      }, 120)
    })
    resizeObserver.observe(heroSection)

    startLoop()

    // Cleanup on component unmount
    return () => {
      clearTimeout(resizeDebounce)
      stopLoop()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      heroVisibilityObserver.disconnect()
      heroSection.removeEventListener("pointermove", highlightDotAt)
      heroSection.removeEventListener("pointerleave", handlePointerLeave)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <section className="hero" aria-labelledby="heroTitle" ref={heroRef}>
      <canvas id="heroCanvas" ref={canvasRef}></canvas>
      <div className="shell hero-inner">
        <h1 id="heroTitle" className="hero-title reveal">
          Your vision,<br />engineered to scale
        </h1>
        <p className="hero-sub reveal">
          Custom web, iOS, AI, and GIS software engineered for ambitious teams.
        </p>
        <div className="hero-actions reveal">
          <button onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))} className="btn btn-solid btn-lg">Let's chat over coffee →</button>
        </div>
      </div>
    </section>
  )
}
