
import axios from 'axios';

// Tạo một instance axios với URL cơ sở API
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Đây là URL của backend Express.js của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header nếu người dùng đã đăng nhập
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
