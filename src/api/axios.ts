import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://www.api.moonsunpower.com/boogle',
  withCredentials: true,
});

export default axiosInstance; 
