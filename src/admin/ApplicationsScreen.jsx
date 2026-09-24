import React, { useState, useEffect, useCallback } from "react"
import { adminFetch } from "./adminApi"

const STATUS_OPTIONS = ["new", "reviewed", "rejected", "hired"]

export default function ApplicationsScreen({ csrfToken, onUnauthorized }) {
  const [jobs, setJobs] = useState([])
  const [jobFilter, setJobFilter] = useState("")
  const [applications, setApplications] = useState([])
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    adminFetch("/api/jobs.php?all=1")
      .then(setJobs)
      .catch((err) => {
        if (err.status === 401) onUnauthorized()
      })
  }, [onUnauthorized])

  const loadApplications = useCallback(async () => {
    setStatus("loading")
    setError("")
    try {
      const query = jobFilter ? `?job_id=${jobFilter}` : ""
      const data = await adminFetch(`/api/applications.php${query}`)
      setApplications(data)
      setStatus("ready")
    } catch (err) {
      if (err.status === 401) {
        onUnauthorized()
        return
      }
      setError(err.message)
      setStatus("error")
    }
  }, [jobFilter, onUnauthorized])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  const handleStatusChange = async (app, newStatus) => {
    setBusyId(app.id)
    try {
      const updated = await adminFetch(`/api/applications.php?id=${app.id}`, {
        method: "PUT",
        csrfToken,
        body: { status: newStatus },
      })
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    } catch (err) {
      if (err.status === 401) {
        onUnauthorized()
        return
      }
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Applications</h3>
        <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className="admin-select">
          <option value="">All jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
      </div>

      {status === "loading" && <p className="admin-empty-state">Loading applications…</p>}

      {status === "error" && (
        <div className="admin-empty-state">
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" onClick={loadApplications}>Retry</button>
        </div>
      )}

      {status === "ready" && applications.length === 0 && (
        <p className="admin-empty-state">No applications yet.</p>
      )}

      {status === "ready" && applications.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Applied</th>
              <th>Status</th>
              <th>Resume</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <React.Fragment key={app.id}>
                <tr>
                  <td>{app.applicantName}</td>
                  <td>{app.jobTitle}</td>
                  <td>{app.applicantEmail}</td>
                  <td>{app.phone || "—"}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value)}
                      disabled={busyId === app.id}
                      className="admin-select"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <a href={`/api/download.php?id=${app.id}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      Download
                    </a>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    >
                      {expandedId === app.id ? "Hide note" : "Cover note"}
                    </button>
                  </td>
                </tr>
                {expandedId === app.id && (
                  <tr>
                    <td colSpan={8} className="admin-table-message">
                      {app.coverNote || "No cover note submitted."}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
