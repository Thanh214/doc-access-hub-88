
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
  isFree?: boolean; // Keep this optional but ensure it's set correctly
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
    const documents = response.data.documents.map((doc: Document) => ({
      ...doc,
      isFree: !doc.is_premium
    }));
    return { documents };
  } catch (error) {
    throw error;
  }
};

export const getDocumentById = async (id: string) => {
  try {
    const response = await API.get(`/documents/${id}`);
    return {
      ...response.data,
      isFree: !response.data.is_premium
    };
  } catch (error) {
    throw error;
  }
};

export const getFeaturedDocuments = async () => {
  try {
    const response = await API.get('/documents/featured');
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: !doc.is_premium
    }));
    return documents;
  } catch (error) {
    throw error;
  }
};

export const getPremiumDocuments = async () => {
  try {
    const response = await API.get('/documents/premium');
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: false
    }));
    return documents;
  } catch (error) {
    throw error;
  }
};

export const getFreeDocuments = async () => {
  try {
    const response = await API.get('/documents/free');
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: true
    }));
    return documents;
  } catch (error) {
    // For demo purposes, return mock data if API fails
    return [
      {
        id: "free-doc-1",
        title: "Giáo Trình Lập Trình Cơ Bản",
        description: "Tài liệu cơ bản về lập trình cho người mới bắt đầu, giới thiệu các khái niệm và ngôn ngữ phổ biến.",
        category: "Lập Trình",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3",
        price: 0,
        is_premium: false,
        is_featured: true,
        user_id: 1,
        previewAvailable: true,
        download_count: 320,
        created_at: "2023-06-15",
        updated_at: "2023-06-15",
        isFree: true
      },
      {
        id: "free-doc-2",
        title: "Hướng Dẫn Tiếng Anh Giao Tiếp",
        description: "Tài liệu học tiếng Anh giao tiếp cơ bản, bao gồm các mẫu câu và từ vựng thông dụng.",
        category: "Ngoại Ngữ",
        thumbnail: "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?ixlib=rb-4.0.3",
        price: 0,
        is_premium: false,
        is_featured: false,
        user_id: 1,
        previewAvailable: true,
        download_count: 250,
        created_at: "2023-07-10",
        updated_at: "2023-07-10",
        isFree: true
      },
      {
        id: "free-doc-3",
        title: "Bài Tập Toán Lớp 12",
        description: "Tổng hợp bài tập toán lớp 12 có lời giải chi tiết, phù hợp để ôn thi đại học.",
        category: "Giáo Dục",
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3",
        price: 0,
        is_premium: false,
        is_featured: true,
        user_id: 1,
        previewAvailable: true,
        download_count: 420,
        created_at: "2023-05-25",
        updated_at: "2023-05-25",
        isFree: true
      }
    ];
  }
};

export const getDocumentsByCategory = async (category: string) => {
  try {
    const response = await API.get(`/documents/category/${category}`);
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: !doc.is_premium
    }));
    return documents;
  } catch (error) {
    throw error;
  }
};

export const searchDocuments = async (query: string) => {
  try {
    const response = await API.get(`/documents/search?q=${query}`);
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: !doc.is_premium
    }));
    return documents;
  } catch (error) {
    throw error;
  }
};

export const getUserDocuments = async () => {
  try {
    const response = await API.get('/documents/my-documents');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurchasedDocuments = async () => {
  try {
    const response = await API.get('/documents/purchased');
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

export const purchaseDocument = async (documentId: string) => {
  try {
    const response = await API.post(`/documents/${documentId}/purchase`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (id: string) => {
  try {
    const response = await API.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

export const getUserDocumentStats = async () => {
  try {
    const response = await API.get('/documents/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadDocument = async (documentId: string) => {
  try {
    const response = await API.get(`/documents/${documentId}/download`, {
      responseType: 'blob',
    });
    
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

// For demo, add functions to simulate document collections
export const getMockPremiumDocuments = () => {
  return [
    {
      id: "premium-doc-1",
      title: "Khóa Học Toàn Diện về Machine Learning",
      description: "Tài liệu chuyên sâu về machine learning với các thuật toán, ứng dụng thực tế và nghiên cứu mới nhất.",
      category: "Công Nghệ",
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3",
      price: 90000,
      is_premium: true,
      is_featured: true,
      user_id: 1,
      previewAvailable: true,
      download_count: 150,
      created_at: "2023-08-10",
      updated_at: "2023-08-10",
      isFree: false
    },
    {
      id: "premium-doc-2",
      title: "Đầu Tư Chứng Khoán Chuyên Nghiệp",
      description: "Phương pháp phân tích và chiến lược đầu tư chứng khoán từ các chuyên gia hàng đầu.",
      category: "Tài Chính",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3",
      price: 120000,
      is_premium: true,
      is_featured: false,
      user_id: 1,
      previewAvailable: true,
      download_count: 85,
      created_at: "2023-07-25",
      updated_at: "2023-07-25",
      isFree: false
    },
    {
      id: "premium-doc-3",
      title: "Chiến Lược Marketing Số Năm 2023",
      description: "Chiến lược marketing số hiệu quả cho doanh nghiệp nhỏ và vừa trong kỷ nguyên số.",
      category: "Marketing",
      thumbnail: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3",
      price: 75000,
      is_premium: true,
      is_featured: true,
      user_id: 1,
      previewAvailable: true,
      download_count: 210,
      created_at: "2023-06-05",
      updated_at: "2023-06-05",
      isFree: false
    }
  ];
};

export const getMockFreeDocuments = () => {
  return [
    {
      id: "free-doc-1",
      title: "Giáo Trình Lập Trình Cơ Bản",
      description: "Tài liệu cơ bản về lập trình cho người mới bắt đầu, giới thiệu các khái niệm và ngôn ngữ phổ biến.",
      category: "Lập Trình",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3",
      price: 0,
      is_premium: false,
      is_featured: true,
      user_id: 1,
      previewAvailable: true,
      download_count: 320,
      created_at: "2023-06-15",
      updated_at: "2023-06-15",
      isFree: true
    },
    {
      id: "free-doc-2",
      title: "Hướng Dẫn Tiếng Anh Giao Tiếp",
      description: "Tài liệu học tiếng Anh giao tiếp cơ bản, bao gồm các mẫu câu và từ vựng thông dụng.",
      category: "Ngoại Ngữ",
      thumbnail: "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?ixlib=rb-4.0.3",
      price: 0,
      is_premium: false,
      is_featured: false,
      user_id: 1,
      previewAvailable: true,
      download_count: 250,
      created_at: "2023-07-10",
      updated_at: "2023-07-10",
      isFree: true
    },
    {
      id: "free-doc-3",
      title: "Bài Tập Toán Lớp 12",
      description: "Tổng hợp bài tập toán lớp 12 có lời giải chi tiết, phù hợp để ôn thi đại học.",
      category: "Giáo Dục",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3",
      price: 0,
      is_premium: false,
      is_featured: true,
      user_id: 1,
      previewAvailable: true,
      download_count: 420,
      created_at: "2023-05-25",
      updated_at: "2023-05-25",
      isFree: true
    }
  ];
};

// For demo, add a simulated payment processing function
export const processDocumentPayment = async (documentId: string, paymentMethod: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    documentId,
    paymentMethod,
    transactionId: `TRANS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    amount: Math.floor(Math.random() * 100000) + 20000,
    date: new Date().toISOString()
  };
};
