
import API from './api';

export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  previewAvailable: boolean;
}

export const getAllDocuments = async () => {
  try {
    const response = await API.get('/documents');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDocumentById = async (id: string) => {
  try {
    const response = await API.get(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeaturedDocuments = async () => {
  try {
    const response = await API.get('/documents/featured');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDocumentsByCategory = async (category: string) => {
  try {
    const response = await API.get(`/documents/category/${category}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchDocuments = async (query: string) => {
  try {
    const response = await API.get(`/documents/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Lấy danh sách tài liệu của người dùng hiện tại
export const getUserDocuments = async () => {
  try {
    // Giả lập dữ liệu vì chưa có API endpoint thực tế
    // Trong thực tế, bạn sẽ gọi API đến backend
    return [
      {
        id: "1",
        title: "Tài liệu luyện thi THPT Quốc Gia môn Toán",
        description: "Bộ tài liệu đầy đủ dành cho học sinh luyện thi THPT Quốc Gia môn Toán với các dạng bài tập từ cơ bản đến nâng cao.",
        category: "Giáo dục",
        thumbnail: "/placeholder.svg",
        price: 50000,
        isFree: false,
        previewAvailable: true
      },
      {
        id: "2",
        title: "Luật Doanh Nghiệp 2020",
        description: "Tài liệu cập nhật đầy đủ về Luật Doanh Nghiệp 2020 với các điều khoản và hướng dẫn chi tiết.",
        category: "Pháp luật",
        thumbnail: "/placeholder.svg",
        price: 0,
        isFree: true,
        previewAvailable: false
      },
      {
        id: "3",
        title: "Học tiếng Anh giao tiếp cơ bản",
        description: "Tài liệu giúp người học nắm vững các kỹ năng giao tiếp tiếng Anh cơ bản trong cuộc sống hàng ngày.",
        category: "Ngoại ngữ",
        thumbnail: "/placeholder.svg",
        price: 30000,
        isFree: false,
        previewAvailable: true
      },
      {
        id: "4",
        title: "Lập trình cơ bản với Python",
        description: "Tài liệu hướng dẫn lập trình Python từ cơ bản đến nâng cao cho người mới bắt đầu.",
        category: "Công nghệ",
        thumbnail: "/placeholder.svg",
        price: 75000,
        isFree: false,
        previewAvailable: true
      }
    ];
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Upload tài liệu mới
export const uploadDocument = async (documentData: Omit<Document, 'id'>) => {
  try {
    // Trong thực tế, bạn sẽ gọi API POST đến backend
    // const response = await API.post('/documents/upload', documentData);
    // return response.data;
    
    // Trả về dữ liệu giả lập
    return {
      success: true,
      message: "Tài liệu đã được tải lên thành công",
      document: {
        id: Math.random().toString(36).substring(2, 9),
        ...documentData
      }
    };
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Xóa tài liệu
export const deleteDocument = async (id: string) => {
  try {
    // Trong thực tế, bạn sẽ gọi API DELETE đến backend
    // const response = await API.delete(`/documents/${id}`);
    // return response.data;
    
    // Trả về dữ liệu giả lập
    return {
      success: true,
      message: "Tài liệu đã được xóa thành công"
    };
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Cập nhật thông tin tài liệu
export const updateDocument = async (id: string, documentData: Partial<Document>) => {
  try {
    // Trong thực tế, bạn sẽ gọi API PUT đến backend
    // const response = await API.put(`/documents/${id}`, documentData);
    // return response.data;
    
    // Trả về dữ liệu giả lập
    return {
      success: true,
      message: "Tài liệu đã được cập nhật thành công",
      document: {
        id,
        title: "Tài liệu đã cập nhật",
        description: "Mô tả mới",
        category: "Danh mục mới",
        thumbnail: "/placeholder.svg",
        price: 50000,
        isFree: false,
        previewAvailable: true,
        ...documentData
      }
    };
  } catch (error) {
    throw error;
  }
};
