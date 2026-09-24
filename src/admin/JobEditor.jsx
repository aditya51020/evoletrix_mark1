import React, { useState } from "react"
import { adminFetch } from "./adminApi"

const emptyJob = {
  title: "",
  department: "",
  location: "",
  experience: "",
  workMode: "",
  about: "",
  responsibilities: [""],
  requirements: [""],
  isPublished: false,
}

export default function JobEditor({ job, csrfToken, onSaved, onCancel, onUnauthorized }) {
  const isEdit = Boolean(job)
  const [form, setForm] = useState(() => (job ? {
    title: job.title,
    department: job.department,
    location: job.location,
    experience: job.experience,
    workMode: job.workMode,
    about: job.about,
    responsibilities: job.responsibilities.length ? job.responsibilities : [""],
    requirements: job.requirements.length ? job.requirements : [""],
    isPublished: job.isPublished,
  } : emptyJob))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const setListItem = (key, idx, value) => {
    setForm((prev) => {
      const next = [...prev[key]]
      next[idx] = value
      return { ...prev, [key]: next }
    })
  }

  const addListItem = (key) => setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }))

  const removeListItem = (key, idx) => {
    setForm((prev) => {
      const next = prev[key].filter((_, i) => i !== idx)
      return { ...prev, [key]: next.length ? next : [""] }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      ...form,
      responsibilities: form.responsibilities.map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.map((s) => s.trim()).filter(Boolean),
    }

    try {
      const saved = isEdit
        ? await adminFetch(`/api/jobs.php?id=${job.id}`, { method: "PUT", csrfToken, body: payload })
        : await adminFetch("/api/jobs.php", { method: "POST", csrfToken, body: payload })
      onSaved(saved)
    } catch (err) {
      if (err.status === 401) {
        onUnauthorized()
        return
      }
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const renderList = (key, label) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="admin-repeatable-list">
        {form[key].map((value, idx) => (
          <div key={idx} className="admin-repeatable-row">
            <input
              type="text"
              value={value}
              onChange={(e) => setListItem(key, idx, e.target.value)}
              disabled={saving}
              placeholder={`${label.slice(0, -1)} ${idx + 1}`}
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => removeListItem(key, idx)}
              disabled={saving}
              aria-label={`Remove ${label.toLowerCase()} ${idx + 1}`}
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => addListItem(key)} disabled={saving} style={{ alignSelf: "flex-start" }}>
          + Add {label.slice(0, -1).toLowerCase()}
        </button>
      </div>
    </div>
  )

  return (
    <form className="admin-panel" onSubmit={handleSubmit}>
      <div className="admin-panel-head">
        <h3>{isEdit ? "Edit job" : "New job"}</h3>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={saving}>Cancel</button>
      </div>

      <div className="admin-form-grid">
        <div className="form-group">
          <label htmlFor="j-title">Title</label>
          <input id="j-title" type="text" required value={form.title} onChange={(e) => setField("title", e.target.value)} disabled={saving} />
        </div>
        <div className="form-group">
          <label htmlFor="j-department">Department</label>
          <input id="j-department" type="text" required value={form.department} onChange={(e) => setField("department", e.target.value)} disabled={saving} />
        </div>
        <div className="form-group">
          <label htmlFor="j-location">Location</label>
          <input id="j-location" type="text" required value={form.location} onChange={(e) => setField("location", e.target.value)} disabled={saving} />
        </div>
        <div className="form-group">
          <label htmlFor="j-experience">Experience</label>
          <input id="j-experience" type="text" required value={form.experience} onChange={(e) => setField("experience", e.target.value)} disabled={saving} placeholder="e.g. Senior (5+ yrs)" />
        </div>
        <div className="form-group">
          <label htmlFor="j-workmode">Work mode</label>
          <input id="j-workmode" type="text" required value={form.workMode} onChange={(e) => setField("workMode", e.target.value)} disabled={saving} placeholder="On-site / Hybrid / Remote" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="j-about">About the role</label>
        <textarea id="j-about" required rows={4} value={form.about} onChange={(e) => setField("about", e.target.value)} disabled={saving} />
      </div>

      {renderList("responsibilities", "Responsibilities")}
      {renderList("requirements", "Requirements")}

      <label className="admin-checkbox-row">
        <input type="checkbox" checked={form.isPublished} onChange={(e) => setField("isPublished", e.target.checked)} disabled={saving} />
        Published (visible on the public Careers page)
      </label>

      {error && <p className="booking-error-msg">{error}</p>}

      <div className="admin-panel-actions">
        <button type="submit" className="btn btn-solid" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create job"}
        </button>
      </div>
    </form>
  )
}
