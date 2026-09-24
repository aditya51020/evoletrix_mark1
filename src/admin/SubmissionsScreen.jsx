import React, { useState, useEffect, useCallback } from "react"
import { adminFetch } from "./adminApi"

const TYPE_FILTERS = [
  { key: "", label: "All" },
  { key: "contact", label: "Coffee chat" },
  { key: "booking", label: "Booking" },
]

export default function SubmissionsScreen({ csrfToken, onUnauthorized }) {
  const [submissions, setSubmissions] = useState([])
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [busyId, setBusyId] = useState(null)

  const loadSubmissions = useCallback(async () => {
    setStatus("loading")
    setError("")
    try {
      const query = typeFilter ? `?type=${typeFilter}` : ""
      const data = await adminFetch(`/api/submissions.php${query}`)
      setSubmissions(data)
      setStatus("ready")
    } catch (err) {
      if (err.status === 401) {
        onUnauthorized()
        return
      }
      setError(err.message)
      setStatus("error")
    }
  }, [typeFilter, onUnauthorized])

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  const toggleRead = async (submission) => {
    setBusyId(submission.id)
    try {
      const updated = await adminFetch(`/api/submissions.php?id=${submission.id}`, {
        method: "PUT",
        csrfToken,
        body: { isRead: !submission.isRead },
      })
      setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
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
        <h3>Submissions</h3>
        <div className="admin-filter-row">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              className={`admin-filter-chip ${typeFilter === f.key ? "is-active" : ""}`}
              onClick={() => setTypeFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {status === "loading" && <p className="admin-empty-state">Loading submissions…</p>}

      {status === "error" && (
        <div className="admin-empty-state">
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" onClick={loadSubmissions}>Retry</button>
        </div>
      )}

      {status === "ready" && submissions.length === 0 && (
        <p className="admin-empty-state">No submissions yet.</p>
      )}

      {status === "ready" && submissions.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date / Time</th>
              <th>Message</th>
              <th>Received</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className={s.isRead ? "" : "admin-row-unread"}>
                <td>{s.type === "booking" ? "Booking" : "Coffee chat"}</td>
                <td>{s.name || "—"}</td>
                <td>{s.email}</td>
                <td>{s.type === "booking" ? `${s.bookingDate} · ${s.bookingTime}` : "—"}</td>
                <td className="admin-table-message">{s.message || "—"}</td>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
                <td className="admin-table-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => toggleRead(s)}
                    disabled={busyId === s.id}
                  >
                    {s.isRead ? "Mark unread" : "Mark read"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
