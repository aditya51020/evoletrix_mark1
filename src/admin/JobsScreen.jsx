import React, { useState, useEffect, useCallback } from "react"
import { adminFetch } from "./adminApi"
import JobEditor from "./JobEditor"

export default function JobsScreen({ csrfToken, onUnauthorized }) {
  const [jobs, setJobs] = useState([])
  const [status, setStatus] = useState("loading") // "loading" | "ready" | "error"
  const [error, setError] = useState("")
  const [editingJob, setEditingJob] = useState(null) // null = list view, {} = new, job = edit
  const [busyId, setBusyId] = useState(null)

  const loadJobs = useCallback(async () => {
    setStatus("loading")
    setError("")
    try {
      const data = await adminFetch("/api/jobs.php?all=1")
      setJobs(data)
      setStatus("ready")
    } catch (err) {
      if (err.status === 401) {
        onUnauthorized()
        return
      }
      setError(err.message)
      setStatus("error")
    }
  }, [onUnauthorized])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const handleSaved = (savedJob) => {
    setJobs((prev) => {
      const exists = prev.some((j) => j.id === savedJob.id)
      return exists ? prev.map((j) => (j.id === savedJob.id ? savedJob : j)) : [savedJob, ...prev]
    })
    setEditingJob(null)
  }

  const handleTogglePublish = async (job) => {
    setBusyId(job.id)
    try {
      const updated = await adminFetch(`/api/jobs.php?id=${job.id}`, {
        method: "PUT",
        csrfToken,
        body: { ...job, isPublished: !job.isPublished },
      })
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)))
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

  const handleDelete = async (job) => {
    if (job.applicantCount > 0) {
      // Button is disabled in this case, but guard against it anyway.
      return
    }
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) {
      return
    }
    setBusyId(job.id)
    try {
      await adminFetch(`/api/jobs.php?id=${job.id}`, { method: "DELETE", csrfToken })
      setJobs((prev) => prev.filter((j) => j.id !== job.id))
    } catch (err) {
      if (err.status === 401) {
        onUnauthorized()
        return
      }
      // Covers the 409 "This job has applicants. Unpublish it instead."
      // case too, in case applicantCount was stale when the button was clicked.
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  if (editingJob !== null) {
    return (
      <JobEditor
        job={Object.keys(editingJob).length ? editingJob : null}
        csrfToken={csrfToken}
        onSaved={handleSaved}
        onCancel={() => setEditingJob(null)}
        onUnauthorized={onUnauthorized}
      />
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Jobs</h3>
        <button className="btn btn-solid btn-sm" onClick={() => setEditingJob({})}>+ New job</button>
      </div>

      {status === "loading" && <p className="admin-empty-state">Loading jobs…</p>}

      {status === "error" && (
        <div className="admin-empty-state">
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" onClick={loadJobs}>Retry</button>
        </div>
      )}

      {status === "ready" && jobs.length === 0 && (
        <p className="admin-empty-state">No jobs yet. Create one to get started.</p>
      )}

      {status === "ready" && jobs.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Work mode</th>
              <th>Applicants</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.department}</td>
                <td>{job.location}</td>
                <td>{job.workMode}</td>
                <td>{job.applicantCount}</td>
                <td>
                  <button
                    className={`admin-badge ${job.isPublished ? "is-published" : "is-draft"}`}
                    onClick={() => handleTogglePublish(job)}
                    disabled={busyId === job.id}
                  >
                    {job.isPublished ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="admin-table-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => setEditingJob(job)} disabled={busyId === job.id}>Edit</button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDelete(job)}
                    disabled={busyId === job.id || job.applicantCount > 0}
                    title={job.applicantCount > 0 ? "This job has applicants — unpublish it instead of deleting." : undefined}
                  >
                    Delete
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
