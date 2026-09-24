import React, { useState } from "react"

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/login.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        onSuccess(data.admin, data.csrfToken)
      } else {
        setError(data.error || "Invalid email or password.")
      }
    } catch (err) {
      setError("Failed to connect to the server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-auth-shell">
      <form className="admin-auth-card" onSubmit={handleSubmit}>
        <span className="admin-auth-brand">Evoletrix Admin</span>

        <div className="form-group">
          <label htmlFor="a-email">Email</label>
          <input
            id="a-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="a-password">Password</label>
          <input
            id="a-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <p className="booking-error-msg">{error}</p>}

        <button type="submit" className="btn btn-solid" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}
