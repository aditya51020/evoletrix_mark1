import React from "react"

// A generic, abstract dashboard skeleton — not a screenshot of any real
// product, and not meant to look like one. Used as visual filler for a
// product preview until a real screenshot exists (see products.js).
export default function AbstractUIMockup({ accent }) {
  return (
    <div className="ui-mockup">
      <div className="ui-mockup-sidebar">
        <span className="ui-mockup-dot" style={{ background: accent }} aria-hidden="true"></span>
        <div className="ui-mockup-bar ui-mockup-bar--accent" style={{ background: accent, width: "72%" }}></div>
        <div className="ui-mockup-bar" style={{ width: "54%" }}></div>
        <div className="ui-mockup-bar" style={{ width: "64%" }}></div>
        <div className="ui-mockup-bar" style={{ width: "46%" }}></div>
        <div className="ui-mockup-bar" style={{ width: "58%" }}></div>
      </div>
      <div className="ui-mockup-main">
        <div className="ui-mockup-topbar">
          <div className="ui-mockup-topbar-title"></div>
          <div className="ui-mockup-topbar-pill" style={{ background: accent }}></div>
        </div>
        <div className="ui-mockup-cards">
          <div className="ui-mockup-card"></div>
          <div className="ui-mockup-card"></div>
          <div className="ui-mockup-card"></div>
        </div>
        <div className="ui-mockup-chart">
          <span style={{ height: "38%" }}></span>
          <span style={{ height: "68%", background: accent }}></span>
          <span style={{ height: "52%" }}></span>
          <span style={{ height: "82%", background: accent }}></span>
          <span style={{ height: "60%" }}></span>
          <span style={{ height: "44%" }}></span>
          <span style={{ height: "72%", background: accent }}></span>
        </div>
      </div>
    </div>
  )
}
