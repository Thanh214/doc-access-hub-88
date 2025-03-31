
import axios, { AxiosInstance } from 'axios';

// Extend the AxiosInstance interface to include our custom method
interface CustomAxiosInstance extends AxiosInstance {
  getFileUrl: (filePath: string) => string | null;
}

// Tạo một instance axios với URL cơ sở API
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Đây là URL của backend Express.js của bạn
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance;

// Interceptor để thêm token vào header nếu người dùng đã đăng nhập
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Thêm interceptor phản hồi để xử lý lỗi
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi toàn cục
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Thêm phương thức để lấy đường dẫn đầy đủ tới file
API.getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // Nếu đã là URL đầy đủ, trả về nguyên vẹn
  if (filePath.startsWith('http')) return filePath;
  
  // Nếu là đường dẫn tương đối, thêm baseURL
  const baseUrl = 'http://localhost:5000'; // Sử dụng base URL của server (không phải API)
  
  // Đảm bảo filePath không bắt đầu bằng dấu / nếu baseUploadUrl đã kết thúc bằng /
  const cleanedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  
  return `${baseUrl}/${cleanedPath}`;
};

export default API;
