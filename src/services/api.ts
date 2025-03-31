
import axios, { AxiosInstance } from 'axios';

// Extend the AxiosInstance interface to include our custom method
interface CustomAxiosInstance extends AxiosInstance {
  getFileUrl: (filePath: string) => string | null;
}

// Create an axios instance with base API URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // URL of your Express.js backend
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance;

// Interceptor to add token to header if user is logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Add method to get full path to file
API.getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // If already a full URL, return it as is
  if (filePath.startsWith('http')) return filePath;
  
  // If it's a relative path, add baseURL
  const baseUrl = 'http://localhost:5000'; // Use server URL (not API)
  
  // Ensure filePath doesn't start with / if baseUploadUrl already ends with /
  const cleanedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  
  return `${baseUrl}/${cleanedPath}`;
};

export default API;
