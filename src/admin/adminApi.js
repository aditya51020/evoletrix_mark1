// Shared fetch helper for the admin dashboard. Always sends the session
// cookie (credentials: "include") and attaches the CSRF token on every
// mutating request, since require_admin() on the backend rejects
// POST/PUT/DELETE without a matching X-CSRF-Token header.
export async function adminFetch(url, { method = "GET", csrfToken, body } = {}) {
  const headers = { "Content-Type": "application/json" }
  if (csrfToken && method !== "GET") {
    headers["X-CSRF-Token"] = csrfToken
  }

  const res = await fetch(url, {
    method,
    credentials: "include",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const error = new Error(data.error || `Request failed (${res.status})`)
    error.status = res.status
    throw error
  }

  return data
}
