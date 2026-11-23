const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const APP_TOKEN = import.meta.env.VITE_API_APP_TOKEN || '';

async function request(endpoint, options = {}) {
  const sesionRaw = localStorage.getItem('sesion_deportes');
  const sesion = sesionRaw ? JSON.parse(sesionRaw) : {};

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Header 1: Autenticación de la aplicación cliente (x-api-token)
  if (APP_TOKEN) {
    headers['x-api-token'] = APP_TOKEN;
  }

  // Header 2: Autorización del usuario autenticado (Bearer <token>)
  const userToken = sesion.token || sesion.accessToken;
  if (userToken) {
    headers.Authorization = `Bearer ${userToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Manejo de 401 Unauthorized: limpiar sesión y redirigir a Login
  if (response.status === 401) {
    localStorage.removeItem('sesion_deportes');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Sesión expirada o no autorizada (401).');
  }

  // Manejo de 403 Forbidden: acceso restringido por rol/permisos
  if (response.status === 403) {
    const forbiddenData = await response.json().catch(() => null);
    throw new Error(forbiddenData?.message || 'Acceso restringido (403): no tienes permisos para esta acción.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Error HTTP ${response.status}`);
  }

  return data;
}

export const apiFetch = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default apiFetch;