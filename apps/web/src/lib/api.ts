import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { matchMockRoute } from '@/lib/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const ENABLE_MOCK_FALLBACK = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

/** True once we detect the backend is unreachable. */
let useMockFallback = false;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Mock-fallback interceptor — runs FIRST on errors (interceptors are LIFO).
// When a request fails because the backend is down (network error or timeout)
// we check for a matching mock route and resolve with fake data so the UI
// renders normally during local development.
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(undefined, (error) => {
  if (!ENABLE_MOCK_FALLBACK) return Promise.reject(error);

  const isNetworkError = !error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.message === 'Network Error');
  if (!isNetworkError) return Promise.reject(error);

  const url = error.config?.url ?? '';
  const method = error.config?.method ?? 'GET';
  const mock = matchMockRoute(url, method);
  if (mock) {
    if (!useMockFallback) {
      useMockFallback = true;
      console.warn('[RobotForge] Backend unreachable — serving mock data in development (set VITE_ENABLE_MOCK_FALLBACK=false to disable).');
    }
    return Promise.resolve({ data: mock, status: 200, statusText: 'OK (mock)', headers: {}, config: error.config });
  }
  return Promise.reject(error);
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await useAuthStore.getState().refreshAccessToken();
        const { accessToken } = useAuthStore.getState();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
