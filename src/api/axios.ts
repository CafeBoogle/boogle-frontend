import axios, { AxiosInstance } from 'axios';
// 'http://localhost:8080'
const axiosInstance: AxiosInstance = axios.create({
  // 환경 변수에서 가져오고, 없으면 기본값으로 localhost 사용
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://www.api.moonsunpower.com/boogle',
  //baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/boogle',
  withCredentials: true,
});
export default axiosInstance; // 이제 이름이 일치합니다.
