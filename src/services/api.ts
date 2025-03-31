import axios from 'axios';

// Tạo một instance axios với URL cơ sở API
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Đây là URL của backend Express.js của bạn
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Thêm credentials
});

// Interceptor để thêm token vào header nếu người dùng đã đăng nhập
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
