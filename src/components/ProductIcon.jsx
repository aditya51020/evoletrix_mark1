import React from "react"

// Renders a product's icon by key. Kept separate from src/data/products.js
// so that file can stay plain data (no JSX), matching the getIcon(key)
// switch pattern already used in ServicesPage.jsx / IndustriesPage.jsx.
export default function ProductIcon({ name, width = 20, height = 20, ...rest }) {
  const props = { viewBox: "0 0 24 24", width, height, fill: "none", stroke: "currentColor", strokeWidth: 2.2, ...rest }

  switch (name) {
    case "map":
      return <svg {...props}><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4Z"/><path d="M8 2v16M16 6v16"/></svg>
    case "folder":
      return <svg {...props}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>
    case "cap":
      return <svg {...props}><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5"/></svg>
    case "hospital":
      return <svg {...props}><path d="M12 2 3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6l-9-4Z"/><path d="M12 8v8M8 12h8"/></svg>
    case "chat":
      return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="15" cy="10" r="1"/></svg>
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>
  }
}
