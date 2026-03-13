import axios, { AxiosInstance } from 'axios';

// 변수명을 소문자로 수정!
const axiosInstance: AxiosInstance = axios.create({
  // 환경 변수에서 가져오고, 없으면 기본값으로 localhost 사용
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
});

export default axiosInstance; // 이제 이름이 일치합니다.
