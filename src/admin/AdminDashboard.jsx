import React, { useState } from "react"
import JobsScreen from "./JobsScreen"
import SubmissionsScreen from "./SubmissionsScreen"
import ApplicationsScreen from "./ApplicationsScreen"

const NAV_ITEMS = [
  { key: "jobs", label: "Jobs" },
  { key: "applications", label: "Applications" },
  { key: "submissions", label: "Submissions" },
]

export default function AdminDashboard({ admin, csrfToken, onLogout, onUnauthorized }) {
  const [activeScreen, setActiveScreen] = useState("jobs")

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">Evoletrix Admin</div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${activeScreen === item.key ? "is-active" : ""}`}
              onClick={() => setActiveScreen(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-sidebar-email">{admin?.email}</span>
          <button className="btn btn-outline btn-sm" onClick={onLogout}>Log out</button>
        </div>
      </aside>

      <main className="admin-content">
        {activeScreen === "jobs" && <JobsScreen csrfToken={csrfToken} onUnauthorized={onUnauthorized} />}
        {activeScreen === "applications" && <ApplicationsScreen csrfToken={csrfToken} onUnauthorized={onUnauthorized} />}
        {activeScreen === "submissions" && <SubmissionsScreen csrfToken={csrfToken} onUnauthorized={onUnauthorized} />}
      </main>
    </div>
  )
}
