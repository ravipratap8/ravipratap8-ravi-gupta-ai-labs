
// Client-side API helper.
// All backend routes are exposed through /api/*.

async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    method: options.method || 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const body = await response.json();
      message = body?.error || body?.message || message;
    } catch {
      // Keep default error message if response is not JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (path) => request(path),

  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body || {}),
    }),

  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body: JSON.stringify(body || {}),
    }),

  del: (path) =>
    request(path, {
      method: 'DELETE',
    }),
};

export const EventOps = {
  stats: () => api.get('/dashboard/stats'),

  events: (queryString = '') => api.get(`/events${queryString}`),
  event: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.del(`/events/${id}`),

  messages: (queryString = '') => api.get(`/messages${queryString}`),
  updateMessage: (id, data) => api.put(`/messages/${id}`, data),

  approvals: () => api.get('/approvals'),
  approve: (id, body) => api.post(`/approvals/${id}/approve`, body),
  reject: (id) => api.post(`/approvals/${id}/reject`, {}),

  classify: (message) => api.post('/ai/classify-message', { message }),
  generateReply: (message, eventId) =>
    api.post('/ai/chat', {
      message,
      eventId,
    }),
  generateContent: (data) => api.post('/ai/generate-content', data),

  contentList: () => api.get('/content'),
  saveContent: (data) => api.post('/content', data),
  deleteContent: (id) => api.del(`/content/${id}`),

  leads: () => api.get('/leads'),
  createLead: (data) => api.post('/leads', data),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),

  auditLogs: () => api.get('/audit-logs'),
  mcpTools: () => api.get('/mcp'),
};
