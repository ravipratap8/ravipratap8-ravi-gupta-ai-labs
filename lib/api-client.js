// Tiny client-side fetch helper. All backend routes are prefixed with /api.

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json())?.error || ''
    } catch {}
    throw new Error(detail || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (p) => request(p, { method: 'GET' }),
  post: (p, body) => request(p, { method: 'POST', body: JSON.stringify(body || {}) }),
  put: (p, body) => request(p, { method: 'PUT', body: JSON.stringify(body || {}) }),
  del: (p) => request(p, { method: 'DELETE' }),
}

// Convenience wrappers used across the dashboard.
export const EventOps = {
  stats: () => api.get('/dashboard/stats'),
  events: (qs = '') => api.get(`/events${qs}`),
  event: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.del(`/events/${id}`),
  messages: (qs = '') => api.get(`/messages${qs}`),
  updateMessage: (id, data) => api.put(`/messages/${id}`, data),
  approvals: () => api.get('/approvals'),
  approve: (id, body) => api.post(`/approvals/${id}/approve`, body),
  reject: (id) => api.post(`/approvals/${id}/reject`, {}),
  classify: (message) => api.post('/ai/classify-message', { message }),
  generateReply: (message, eventId) => api.post('/ai/chat', { message, eventId }),
  generateContent: (data) => api.post('/ai/generate-content', data),
  contentList: () => api.get('/content'),
  saveContent: (data) => api.post('/content', data),
  deleteContent: (id) => api.del(`/content/${id}`),
  leads: () => api.get('/leads'),
  createLead: (data) => api.post('/leads', data),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  auditLogs: () => api.get('/audit-logs'),
  mcpTools: () => api.get('/mcp'),
}
