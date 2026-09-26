import React from "react"

// "Evoletrix" wordmark: "Evo" at reduced opacity, "letrix" at full opacity,
// with the dot of the "i" recolored to the brand blue — replaces the old
// geometric cube icon + plain text lockup with a proper logo mark.
export default function Wordmark({ height = 22 }) {
  return (
    <svg
      viewBox="0 0 126 40"
      height={height}
      width={height * (126 / 40)}
      role="img"
      aria-label="Evoletrix"
    >
      <text
        x="0"
        y="30"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        fontSize="30"
        letterSpacing="-0.01em"
      >
        <tspan fill="currentColor" fillOpacity="0.5">Evo</tspan>
        <tspan fill="currentColor">letr</tspan>
        <tspan fill="currentColor">{"ı"}</tspan>
        <tspan fill="currentColor">x</tspan>
      </text>
      <circle cx="104.8" cy="10.2" r="2.4" fill="#2f6bff" />
    </svg>
  )
}
