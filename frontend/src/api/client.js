const API_BASE = '/api';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('storyforge_token');
  if (token) headers['x-auth-token'] = token;
  return headers;
};

// Normalize endpoint to prevent FastAPI 307 redirects
function normalizeEndpoint(endpoint) {
  if (endpoint.includes('?')) return endpoint;
  
  const parts = endpoint.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1];
  
  // If last part is an ID (numeric), do NOT append trailing slash
  if (lastPart && !isNaN(lastPart)) {
    return endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
  }
  
  // For collection endpoints (e.g. /stories, /settings), append trailing slash
  return endpoint.endsWith('/') ? endpoint : endpoint + '/';
}

export const apiClient = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE}${normalizeEndpoint(endpoint)}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  async post(endpoint, data) {
    const res = await fetch(`${API_BASE}${normalizeEndpoint(endpoint)}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  async put(endpoint, data) {
    const res = await fetch(`${API_BASE}${normalizeEndpoint(endpoint)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  async delete(endpoint) {
    const res = await fetch(`${API_BASE}${normalizeEndpoint(endpoint)}`, { 
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
