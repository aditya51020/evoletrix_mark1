import React, { useState, useEffect } from "react"
import AdminLogin from "./AdminLogin"
import AdminDashboard from "./AdminDashboard"

// Entry point for everything under #admin-login / #admin. This whole
// module is React.lazy-loaded from App.jsx, so none of it (or the admin
// CSS it depends on) lands in the public site's initial bundle.
export default function AdminApp() {
  const [authState, setAuthState] = useState("checking") // "checking" | "authed" | "guest"
  const [admin, setAdmin] = useState(null)
  const [csrfToken, setCsrfToken] = useState("")

  const checkSession = async () => {
    try {
      const res = await fetch("/api/admin/me.php", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setAdmin(data.admin)
        setCsrfToken(data.csrfToken)
        setAuthState("authed")
        if (window.location.hash === "#admin-login") {
          window.location.hash = "#admin"
        }
      } else {
        setAuthState("guest")
        if (window.location.hash !== "#admin-login") {
          window.location.hash = "#admin-login"
        }
      }
    } catch (err) {
      setAuthState("guest")
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  const handleLoginSuccess = (adminData, token) => {
    setAdmin(adminData)
    setCsrfToken(token)
    setAuthState("authed")
    window.location.hash = "#admin"
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout.php", {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-Token": csrfToken },
      })
    } catch (err) {
      // Best effort — clear local state regardless.
    }
    setAdmin(null)
    setCsrfToken("")
    setAuthState("guest")
    window.location.hash = "#admin-login"
  }

  if (authState === "checking") {
    return (
      <div className="admin-auth-shell">
        <p style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>Loading…</p>
      </div>
    )
  }

  if (authState === "guest") {
    return <AdminLogin onSuccess={handleLoginSuccess} />
  }

  return (
    <AdminDashboard
      admin={admin}
      csrfToken={csrfToken}
      onCsrfRefresh={setCsrfToken}
      onLogout={handleLogout}
      onUnauthorized={() => {
        setAdmin(null)
        setCsrfToken("")
        setAuthState("guest")
        window.location.hash = "#admin-login"
      }}
    />
  )
}
