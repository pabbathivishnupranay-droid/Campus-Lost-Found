import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const normalizedBase = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : '';

export const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const assetPath = url.startsWith('/') ? url : `/${url}`;
  return normalizedBase ? `${normalizedBase}${assetPath}` : assetPath;
};

const api = axios.create({
  baseURL: normalizedBase ? `${normalizedBase}/api` : '/api',
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
