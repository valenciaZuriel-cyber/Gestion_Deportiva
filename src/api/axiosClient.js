import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const sesionRaw = sessionStorage.getItem('sesion_deportes');
  if (sesionRaw) {
    const { accessToken } = JSON.parse(sesionRaw);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const sesionRaw = sessionStorage.getItem('sesion_deportes');
        const sesion = sesionRaw ? JSON.parse(sesionRaw) : {};
        const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
          refreshToken: sesion.refreshToken,
        });

        const updatedSesion = {
          ...sesion,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || sesion.refreshToken,
        };
        sessionStorage.setItem('sesion_deportes', JSON.stringify(updatedSesion));

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem('sesion_deportes');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;