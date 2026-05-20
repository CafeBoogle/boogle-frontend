import axios, { AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.api.moonsunpower.com/boogle';

// 일반 요청용
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// refresh 전용 (interceptor 없는 순수 인스턴스)
const authAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Access Token 헤더 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 토큰 만료 시 Refresh Token으로 재발급
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response?.data;

    if (
      error.response?.status === 401 &&
      errorMessage === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // authAxios 사용 → 만료된 토큰 안 붙음
        const res = await authAxios.post('/auth/refresh');
        const newToken = res.data.accessToken;

        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (e) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
