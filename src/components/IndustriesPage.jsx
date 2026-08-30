import React, { useState } from "react"

export default function IndustriesPage() {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [clickedIdx, setClickedIdx] = useState(0) // Default to first industry (Healthcare)

  const activeIdx = hoveredIdx !== null ? hoveredIdx : clickedIdx

  const getIcon = (iconName) => {
    switch (iconName) {
      case "healthcare":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19V5"/></svg>
      case "wearables":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="12" height="16" rx="3"/><path d="M10 8h4M12 16h.01"/></svg>
      case "fitness":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 8H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2M6 12h12"/></svg>
      case "ondemand":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"/></svg>
      case "restaurant":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      case "construction":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
      case "politics":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16M4 18h16M4 6l8-4 8 4v12H4V6ZM9 10v4M15 10v4"/></svg>
      case "emobility":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.5 2h-13A2.5 2.5 0 0 0 3 4.5v15A2.5 2.5 0 0 0 5.5 22h13a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 18.5 2ZM9 12l2 4 4-7"/></svg>
      case "finance":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
      case "entertainment":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></svg>
      case "education":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
      case "events":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      case "manufacturing":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M5 17V7l4 4V7l4 4V7l4 4h3v10H5Z"/></svg>
      case "energy":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M5 12h14M18.5 5.5l-13 13M5.5 5.5l13 13"/></svg>
      case "ott":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><path d="m17 2-5 5-5-5"/></svg>
      case "fooddelivery":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 2v9M8 5h8"/></svg>
      case "ecommerce":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      case "travel":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/></svg>
      case "realestate":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      case "magazine":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3Zm0-3h18M8 7h8M8 11h8M8 15h5"/></svg>
      case "socialmedia":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      case "aviation":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-2-2h-3l-4-4H9l2 8H6L4 8H2v8h2l2-2h5l-2 8h3l4-4h3a2 2 0 0 0 2-2Z"/></svg>
      case "csr":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/></svg>
      case "retail":
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
      default:
        return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
    }
  }

  const industries = [
    { name: "Healthcare", key: "healthcare", info: "HIPAA-compliant software systems designed for clinics and hospitals.", whatWeDid: "Engineered an automated diagnostics portal reducing patient record access latency by 45%.", brands: ["HealthSync", "MediCare Labs"] },
    { name: "Wearables", key: "wearables", info: "IoT wearable device data synchronization and telemetry dashboards.", whatWeDid: "Created a real-time Bluetooth sync API for heart-rate tracking smart bands.", brands: ["FitBand", "PulseGo"] },
    { name: "Fitness", key: "fitness", info: "Personal training apps, workout builders, and video instruction databases.", whatWeDid: "Built a modular workout planner serving 10k+ active training sessions daily.", brands: ["GymCore", "FlexFit"] },
    { name: "On-Demand", key: "ondemand", info: "Real-time courier, taxi, and local delivery routing software.", whatWeDid: "Developed a geospatial driver dispatch algorithm with under 2-second match times.", brands: ["QuickCab", "LogiRun"] },
    { name: "Restaurant", key: "restaurant", info: "Kitchen display systems, digital menu ordering, and reservation books.", whatWeDid: "Implemented an iPad ordering menu system for a 12-location dining chain.", brands: ["BistroQ", "DineEasy"] },
    { name: "Construction", key: "construction", info: "Project site management trackers, estimators, and blueprint logs.", whatWeDid: "Engineered a cloud-based blueprint viewer with offline caching for field workers.", brands: ["BuildTech", "SteelLog"] },
    { name: "Politics", key: "politics", info: "Voter database campaign mapping and analytics dashboard tools.", whatWeDid: "Designed a voter sentiment visualization chart showing precinct demographic breakdowns.", brands: ["VoteMap", "CivicPulse"] },
    { name: "EMobility", key: "emobility", info: "EV charging station telemetry trackers and route optimization mapping.", whatWeDid: "Created a charger queue estimation algorithm for municipal electric fleets.", brands: ["GridCharge", "VoltCar"] },
    { name: "Finance", key: "finance", info: "FinTech bank integrations, ledger auditing, and secure transaction logs.", whatWeDid: "Built a custom multi-currency settlement ledger handling $500k+ in daily volumes.", brands: ["Trust Pay", "Apex Wealth"] },
    { name: "Entertainment", key: "entertainment", info: "Event ticket bookings, artist dashboards, and digital media channels.", whatWeDid: "Engineered a high-concurrency seat reservation booking engine for movie theater releases.", brands: ["CinemaBook", "ShowTix"] },
    { name: "Education", key: "education", info: "Learning Management Systems (LMS), virtual classrooms, and grading matrices.", whatWeDid: "Pioneered a live classroom system with real-time whiteboards for 2,500 students.", brands: ["EduLive", "ClassBoard"] },
    { name: "Events", key: "events", info: "Exhibition layout grids, schedule organizers, and check-in scanner apps.", whatWeDid: "Developed a QR scanner check-in ticket system running on standard iOS devices.", brands: ["TicketScan", "ExpoGrid"] },
    { name: "Manufacturing", key: "manufacturing", info: "Inventory logistics, warehouse tracking, and equipment maintenance logs.", whatWeDid: "Built a machine uptime monitoring system integrating with PLC factory controllers.", brands: ["PLCMonitor", "FactoryIQ"] },
    { name: "Energy", key: "energy", info: "Solar output grid trackers, billing integrations, and usage predictors.", whatWeDid: "Constructed a solar energy predictive modeling dashboard for community grids.", brands: ["SolarGrid", "PowerPredict"] },
    { name: "OTT", key: "ott", info: "Live audio/video streaming, subscription access systems, and CDN maps.", whatWeDid: "Optimized a HLS video streaming pipeline reducing initial playback buffer to 0.8s.", brands: ["HLSStream", "PlayTube"] },
    { name: "Food Delivery", key: "fooddelivery", info: "Restaurant integrations, courier route mapping, and real-time order states.", whatWeDid: "Engineered a delivery dispatch pipeline handling 5,000 active riders.", brands: ["SpeedyEat", "SquadRider"] },
    { name: "Ecommerce", key: "ecommerce", info: "Storefront engines, checkout carts, and dynamic inventory sync tables.", whatWeDid: "Built an ecommerce storefront with instant search syncing across 50,000 SKUs.", brands: ["FastCart", "SearchSync"] },
    { name: "Travel", key: "travel", info: "Itinerary builders, hotel room planners, and map location routing.", whatWeDid: "Designed a customized family travel planner with maps and offline synchronization.", brands: ["FamTrip", "GeoMap"] },
    { name: "Real Estate", key: "realestate", info: "MLS property search maps, agent CRM tables, and virtual home tours.", whatWeDid: "Integrated a geo-referencing map searching properties by radius and custom bounds.", brands: ["GeoSearch", "MLSMap"] },
    { name: "Magazine & Newspaper", key: "magazine", info: "Editorial publishing workflows, subscription paywalls, and newsletters.", whatWeDid: "Pioneered a serverless editorial engine delivering content to 1M+ monthly readers.", brands: ["NewsEngine", "PayWallX"] },
    { name: "Social Media", key: "socialmedia", info: "Community channels, real-time messaging, and feed ranking algos.", whatWeDid: "Built a secure, encrypted direct messaging system with typing status indicators.", brands: ["ChatSec", "FeedRank"] },
    { name: "Aviation", key: "aviation", info: "Flight scheduling boards, crew logbooks, and maintenance compliance.", whatWeDid: "Engineered a pilot duty-time log tracker compliant with CAA regulation frameworks.", brands: ["AeroCompliance", "CrewLog"] },
    { name: "CSR", key: "csr", info: "Carbon footprint calculators, corporate donation trackers, and ESG reports.", whatWeDid: "Built an ESG carbon output auditing dashboard for mid-market clients.", brands: ["CarbonCalc", "DonationTrack"] },
    { name: "Retail", key: "retail", info: "POS inventory sync systems, loyalty schemes, and barcode managers.", whatWeDid: "Constructed a retail POS inventory manager with real-time sync.", brands: ["POSSync", "LoyaltyCard"] }
  ]

  return (
    <>
      {/* SECTION 1: Dark grid with Sticky matching Detail Panel */}
      <section className="section industries-page-section" aria-labelledby="indPageTitle" style={{ paddingBlock: "96px 64px" }}>
        <div className="shell">
          <header className="ind-page-header">
            <h1 id="indPageTitle" className="display" style={{ marginBottom: "16px" }}>Industries We Serve</h1>
            <p className="ind-page-sub">
              Delivering scalable software solutions to leading international brands, tech startups, and enterprise giants alike. Our team of engineers and designers specialize in building custom software systems for a wide range of industries, ensuring that each solution is tailored to meet the unique needs of our clients.
            </p>
          </header>

          <div className="ind-split-layout">
            {/* Master Grid (Left side) */}
            <div className="ind-master-grid">
              {industries.map((ind, idx) => {
                const isActive = activeIdx === idx
                return (
                  <div
                    key={idx}
                    className={`ind-card ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => setClickedIdx(idx)}
                  >
                    <div className="ind-icon-wrapper">
                      {getIcon(ind.key)}
                    </div>
                    <span className="ind-title">{ind.name}</span>
                  </div>
                )
              })}
            </div>

            {/* Details Panel (Right side) - White Background Image Card */}
            <div className="ind-details-panel">
              {/* Image/Gradient header box with centered icon and padding/margin styling */}
              <div className="ind-details-visual-header">
                <span className="ind-details-visual-icon">
                  {getIcon(industries[activeIdx].key)}
                </span>
              </div>

              <div className="ind-details-content">
                <h3>{industries[activeIdx].name}</h3>
                
                <div className="ind-details-section">
                  <p className="ind-details-desc">{industries[activeIdx].info}</p>
                </div>
                
                <div className="ind-details-section" style={{ marginTop: "20px" }}>
                  <h4>WHAT WE SHIPPED</h4>
                  <div style={{ display: "flex", gap: "10px", alignItems: "start", marginTop: "8px" }}>
                    <span style={{ color: "var(--brand)", fontWeight: "bold", fontSize: "15px" }}>|</span>
                    <span style={{ color: "#27272a", fontSize: "13.5px", lineHeight: "1.5" }}>
                      {industries[activeIdx].whatWeDid}
                    </span>
                  </div>
                </div>
                
                <div className="ind-details-section" style={{ marginTop: "24px" }}>
                  <h4>PARTNER BRANDS</h4>
                  <div style={{ display: "flex", gap: "22px", flexWrap: "wrap", marginTop: "10px", alignItems: "center" }}>
                    {industries[activeIdx].brands.map((brand, bIdx) => (
                      <span 
                        key={bIdx} 
                        style={{ 
                          fontSize: "13px", 
                          fontWeight: "700", 
                          fontFamily: "var(--font-mono)", 
                          color: "#71717a", 
                          letterSpacing: "0.08em" 
                        }}
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
                className="btn btn-dark ind-details-btn"
              >
                Discuss a project in this sector →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer transition: Dark to Light (Black to White) */}
      <div className="bg-transition-spacer" aria-hidden="true"></div>

      {/* SECTION 2: Light Block - Testimonials */}
      <section className="section outcomes theme-light-block" style={{ paddingBlock: "96px 48px" }}>
        <div className="shell">
          <header className="ind-page-header">
            <h2 className="display" style={{ color: "var(--light-fg)" }}>Industry leaders have something to say about us</h2>
          </header>

          {/* Testimonial Cards Grid (6 total cards in 2 rows of 3) */}
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px 32px", background: "none", boxShadow: "none" }}>
            {/* Card 1 */}
            <div className="stat" style={{ background: "var(--light-panel)", border: "none", borderRadius: "var(--radius)", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.6", fontStyle: "italic", color: "#44444a" }}>
                "Evoletrix engineered our HIPAA-compliant portal with absolute precision. Their team integrated directly into our Slack and felt like a true extension of our squad."
              </p>
              <div style={{ marginTop: "20px" }}>
                <strong style={{ display: "block", fontSize: "13px", color: "var(--light-fg)" }}>Dr. Sarah Jenkins</strong>
                <span style={{ fontSize: "11px", color: "var(--fg-dim)", fontFamily: "var(--font-mono)" }}>CTO at HealthSync</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="stat" style={{ background: "var(--light-panel)", border: "none", borderRadius: "var(--radius)", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.6", fontStyle: "italic", color: "#44444a" }}>
                "The FinTech ledger Evoletrix built handles our massive daily volume flawlessly. Outstanding code quality, security compliance, and turnaround speed."
              </p>
              <div style={{ marginTop: "20px" }}>
                <strong style={{ display: "block", fontSize: "13px", color: "var(--light-fg)" }}>David Vance</strong>
                <span style={{ fontSize: "11px", color: "var(--fg-dim)", fontFamily: "var(--font-mono)" }}>VP of Engineering at Trust Pay</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="stat" style={{ background: "var(--light-panel)", border: "none", borderRadius: "var(--radius)", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.6", fontStyle: "italic", color: "#44444a" }}>
                "Their custom routing algorithm cut our courier delivery match times in half. The level of transparency we received during development was world-class."
              </p>
              <div style={{ marginTop: "20px" }}>
                <strong style={{ display: "block", fontSize: "13px", color: "var(--light-fg)" }}>Liam O'Connor</strong>
                <span style={{ fontSize: "11px", color: "var(--fg-dim)", fontFamily: "var(--font-mono)" }}>Director of Logistics at LogiRun</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="stat" style={{ background: "var(--light-panel)", border: "none", borderRadius: "var(--radius)", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.6", fontStyle: "italic", color: "#44444a" }}>
                "Their retail inventory sync engine handles our 50k SKUs in real-time. Extremely robust build quality and stellar execution."
              </p>
              <div style={{ marginTop: "20px" }}>
                <strong style={{ display: "block", fontSize: "13px", color: "var(--light-fg)" }}>Marcus Aurelius</strong>
                <span style={{ fontSize: "11px", color: "var(--fg-dim)", fontFamily: "var(--font-mono)" }}>Founder at POSSync</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="stat" style={{ background: "var(--light-panel)", border: "none", borderRadius: "var(--radius)", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.6", fontStyle: "italic", color: "#44444a" }}>
                "Evoletrix built our solar energy telemetry pipeline under a tight timeline. Speed, precision, and absolute technical competence."
              </p>
              <div style={{ marginTop: "20px" }}>
                <strong style={{ display: "block", fontSize: "13px", color: "var(--light-fg)" }}>Aisha Rahman</strong>
                <span style={{ fontSize: "11px", color: "var(--fg-dim)", fontFamily: "var(--font-mono)" }}>Head of Infrastructure at SolarGrid</span>
              </div>
            </div>

            {/* Card 6 */}
            <div className="stat" style={{ background: "var(--light-panel)", border: "none", borderRadius: "var(--radius)", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.6", fontStyle: "italic", color: "#44444a" }}>
                "The offline-first blueprint sync tool is a game-changer for our field operations. Absolute game-changers in developer tooling."
              </p>
              <div style={{ marginTop: "20px" }}>
                <strong style={{ display: "block", fontSize: "13px", color: "var(--light-fg)" }}>Carlos Mendez</strong>
                <span style={{ fontSize: "11px", color: "var(--fg-dim)", fontFamily: "var(--font-mono)" }}>CTO at BuildTech</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Light Block - Global Brands */}
      <section className="section sdk theme-light-block" style={{ paddingBlock: "48px 96px" }}>
        <div className="shell">
          <header className="ind-page-header" style={{ marginBottom: "56px" }}>
            <h2 className="display" style={{ color: "var(--light-fg)" }}>We serve industries across the globe</h2>
            <p style={{ color: "var(--fg-dim)", fontSize: "15px", marginTop: "12px" }}>
              Evoletrix delivers scalable software solutions to leading international brands, tech startups, and enterprise giants alike.
            </p>
          </header>

          <div className="logo-strip" style={{ marginTop: "0", display: "grid", gap: "36px" }}>
            {/* Row 1 of Brands */}
            <ul style={{ gap: "48px" }}>
              <li style={{ color: "#18181b", fontWeight: "700" }}>STRIPE</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>AIRBNB</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>UBER</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>REVOLUT</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>SLACK</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>COINBASE</li>
            </ul>
            
            {/* Row 2 of Brands */}
            <ul style={{ gap: "48px" }}>
              <li style={{ color: "#18181b", fontWeight: "700" }}>SHOPIFY</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>ZOOM</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>FIGMA</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>VERCEL</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>NOTION</li>
              <li style={{ color: "#18181b", fontWeight: "700" }}>SPOTIFY</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Spacer transition: Light to Dark (White to Black) */}
      <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>
    </>
  )
}
