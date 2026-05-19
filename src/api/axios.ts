import axios, { AxiosInstance } from 'axios';
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://www.api.moonsunpower.com/boogle',
  withCredentials: true,
});

// Access Token 헤더 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

    console.log('저장된 토큰:', token);
  console.log('Authorization 헤더:', config.headers.Authorization);
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

    // refresh 요청이면 무시
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data;

    if (
      error.response?.status === 401 &&
      errorMessage === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axiosInstance.post('/auth/refresh');
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
<<<<<<< Updated upstream
export default axiosInstance;
=======

export default axiosInstance;
>>>>>>> Stashed changes
