import axios, { AxiosInstance } from 'axios';

// 변수명을 소문자로 수정!
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
});

export default axiosInstance; // 이제 이름이 일치합니다.