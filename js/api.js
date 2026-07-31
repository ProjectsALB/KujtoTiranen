/**
 * Kujto Tiranën — Frontend API client
 * Change API_BASE if backend runs on another host/port
 */
const API_BASE = localStorage.getItem('KT_API_BASE') || (
  (location.port === '5000' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? (location.origin + '/api/v1')
    : 'http://localhost:5000/api/v1'
);

async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('KT_TOKEN');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    data = { success: false, message: 'Invalid response from server' };
  }
  if (!res.ok) {
    const msg = data.message || data.errors?.[0]?.msg || `Error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** GET approved photos for a location */
async function getPhotosFromBackend(locationKey) {
  return apiRequest(`/photos/${encodeURIComponent(locationKey)}`);
}

/** Upload photo (FormData with image + fields) */
async function uploadPhotoToBackend(formData) {
  return apiRequest('/photos', { method: 'POST', body: formData });
}

/** Submit contact form */
async function submitContactForm(payload) {
  return apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function loginUser(email, password) {
  return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}
async function registerUser(name, email, password) {
  return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

window.KT_API = {
  loginUser,
  registerUser,
  API_BASE,
  getPhotosFromBackend,
  uploadPhotoToBackend,
  submitContactForm,
  apiRequest,
};
