const BASE_URL = import.meta.env.VITE_API_URL || 'https://proyecto-idgs9-v1.onrender.com';
const APP_TOKEN = import.meta.env.VITE_API_APP_TOKEN || '';

async function request(endpoint, options = {}) {
  const sesionRaw = localStorage.getItem('sesion_deportes');
  let sesion = {};
  try {
    sesion = sesionRaw ? JSON.parse(sesionRaw) : {};
  } catch {
    sesion = {};
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (APP_TOKEN) {
    headers['x-api-token'] = APP_TOKEN;
  }

  const userToken = sesion.token || sesion.accessToken;
  if (userToken) {
    headers.Authorization = `Bearer ${userToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('sesion_deportes');
    const esLogin = endpoint.includes('/auth/login');
    if (!esLogin && window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.replace('/login');
    }
    throw new Error(
      esLogin
        ? 'Correo o contraseña incorrectos (401).'
        : 'Sesión expirada o no autorizada (401).'
    );
  }

  if (response.status === 403) {
    const forbiddenData = await response.json().catch(() => null);
    throw new Error(forbiddenData?.message || 'Acceso restringido (403).');
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