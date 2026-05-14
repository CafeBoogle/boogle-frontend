import axios, { AxiosInstance } from 'axios';
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://www.api.moonsunpower.com/boogle',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // refresh 요청이면 무시
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }
    // 토큰 만료일 때만 refresh
    const errorMessage = error.response?.data;

    if (
      error.response?.status === 401 &&
      errorMessage === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('/auth/refresh');
        return axiosInstance(originalRequest);
      } catch (e) {
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
export default axiosInstance;
