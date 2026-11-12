// Minimal fetch wrapper. All requests go through /api (proxied to Spring Boot in dev).
export async function http(path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the backend. Is it running on port 8080?')
  }

  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  if (!res.ok) {
    throw new Error((data && data.message) || `Request failed (${res.status})`)
  }
  return data
}
