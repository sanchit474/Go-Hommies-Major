import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to request headers
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminAuthToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
