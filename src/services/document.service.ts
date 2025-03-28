
import API from './api';

export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  is_premium: boolean;
  is_featured: boolean;
  user_id: number;
  previewAvailable: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentStats {
  totalUploads: number;
  totalDownloads: number;
  remainingUploads: number;
  remainingDownloads: number;
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

export const getPremiumDocuments = async () => {
  try {
    const response = await API.get('/documents/premium');
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

// Lấy danh sách tài liệu của người dùng hiện tại
export const getUserDocuments = async () => {
  try {
    const response = await API.get('/documents/my-documents');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tài liệu đã mua của người dùng hiện tại
export const getPurchasedDocuments = async () => {
  try {
    const response = await API.get('/documents/purchased');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload tài liệu mới
export const uploadDocument = async (formData: FormData) => {
  try {
    const response = await API.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mua tài liệu
export const purchaseDocument = async (documentId: string) => {
  try {
    const response = await API.post(`/documents/${documentId}/purchase`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xóa tài liệu
export const deleteDocument = async (id: string) => {
  try {
    const response = await API.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật thông tin tài liệu
export const updateDocument = async (id: string, formData: FormData) => {
  try {
    const response = await API.put(`/documents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy thống kê về tài liệu của người dùng
export const getUserDocumentStats = async () => {
  try {
    const response = await API.get('/documents/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tải xuống tài liệu
export const downloadDocument = async (documentId: string) => {
  try {
    const response = await API.get(`/documents/${documentId}/download`, {
      responseType: 'blob',
    });
    
    // Tạo URL cho blob và tải xuống
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `document-${documentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};
