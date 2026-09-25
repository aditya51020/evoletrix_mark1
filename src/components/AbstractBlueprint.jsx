import React from "react"

// A generic, abstract "blueprint" pattern — irregular outlined blocks,
// evoking a map/architectural drawing without being a screenshot of any
// real product or an actual map. Visual filler for a product preview
// until a real screenshot exists (see products.js).
export default function AbstractBlueprint({ color }) {
  // Loose, deterministic block layout (not random per render) so the
  // pattern doesn't reshuffle on every re-render/selection change.
  const blocks = [
    { x: 6, y: 10, w: 26, h: 34 },
    { x: 36, y: 6, w: 18, h: 20 },
    { x: 58, y: 10, w: 30, h: 14 },
    { x: 58, y: 28, w: 14, h: 22 },
    { x: 76, y: 28, w: 12, h: 12 },
    { x: 6, y: 50, w: 16, h: 16 },
    { x: 26, y: 48, w: 22, h: 26 },
    { x: 52, y: 54, w: 16, h: 20 },
    { x: 72, y: 54, w: 20, h: 12 },
    { x: 72, y: 70, w: 12, h: 14 },
    { x: 10, y: 70, w: 12, h: 14 },
    { x: 26, y: 78, w: 20, h: 10 },
  ]

  return (
    <div className="ui-blueprint">
      <svg viewBox="0 0 100 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <line x1="0" y1="45" x2="100" y2="45" className="ui-blueprint-road" />
        <line x1="50" y1="0" x2="50" y2="90" className="ui-blueprint-road" />
        {blocks.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="1.5"
            fill={color}
            fillOpacity={i % 3 === 0 ? 0.16 : 0.06}
            stroke={color}
            strokeOpacity="0.5"
            strokeWidth="0.6"
          />
        ))}
      </svg>
    </div>
  )
}
