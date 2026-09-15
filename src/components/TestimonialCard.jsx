import React from "react"

// Shared testimonial card: gradient-initial avatar + name/role identity panel
// + a quote panel with the decorative oversized quotation mark. Originally
// built for the About page's client carousel; reused as-is (via the `size`
// variant) for the Industries page's testimonial grid.
export default function TestimonialCard({
  name,
  role,
  company,
  text,
  avatarGrad = "linear-gradient(135deg, var(--brand), var(--brand-cyan))",
  logoLabel,
  size = "sm",
  children,
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")

  return (
    <div className={`testimonial-card${size === "lg" ? " testimonial-card--lg" : ""}`}>
      <div className="testimonial-card-header">
        <div className="testimonial-avatar" style={{ background: avatarGrad }}>
          <span>{initials}</span>
        </div>
        <div className="testimonial-identity">
          <h4>{name}</h4>
          <span>{company ? `${role}, ${company}` : role}</span>
        </div>
        {logoLabel && <div className="testimonial-logo-badge">{logoLabel}</div>}
      </div>

      <div className="testimonial-quote">
        <span className="testimonial-quote-mark" aria-hidden="true">&ldquo;</span>
        <p>{text}</p>
        {children}
      </div>
    </div>
  )
}
