export const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = "Request failed";
    try { const j = await res.json(); msg = j.detail || JSON.stringify(j); } catch {}
    throw new Error(msg);
  }
  return res.json();
}
