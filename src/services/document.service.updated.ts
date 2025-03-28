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
  isFree?: boolean;
  file_size?: string;
  pages?: number;
  chapters?: number;
}

export interface DocumentStats {
  totalUploads: number;
  totalDownloads: number;
  remainingUploads: number;
  remainingDownloads: number;
}

// Function to get all documents from the database
export const getAllDocuments = async () => {
  try {
    const response = await API.get('/documents');
    const documents = response.data.documents.map((doc: Document) => ({
      ...doc,
      isFree: !doc.is_premium
    }));
    return { documents };
  } catch (error) {
    console.error('Error fetching all documents:', error);
    throw error;
  }
};

// Function to get a specific document by ID
export const getDocumentById = async (id: string) => {
  try {
    const response = await API.get(`/documents/${id}`);
    return {
      ...response.data,
      isFree: !response.data.is_premium
    };
  } catch (error) {
    console.error('Error fetching document by ID:', error);
    
    // For demo purposes, if API fails, try to get from mock data
    console.log("Falling back to mock data for demo");
    const allMockDocs = [...getMockFreeDocuments(), ...getMockPremiumDocuments()];
    const mockDoc = allMockDocs.find(d => d.id === id);
    
    if (mockDoc) {
      return mockDoc;
    }
    
    throw error;
  }
};

// Function to get featured documents
export const getFeaturedDocuments = async () => {
  try {
    const response = await API.get('/documents/featured');
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: !doc.is_premium
    }));
    return documents;
  } catch (error) {
    console.error('Error fetching featured documents:', error);
    throw error;
  }
};

// Function to get premium documents
export const getPremiumDocuments = async () => {
  try {
    const response = await API.get('/documents/premium');
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: false
    }));
    return documents;
  } catch (error) {
    console.error('Error fetching premium documents:', error);
    return getMockPremiumDocuments();
  }
};

// Function to get free documents
export const getFreeDocuments = async () => {
  try {
    const response = await API.get('/documents/free');
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: true
    }));
    return documents;
  } catch (error) {
    console.error('Error fetching free documents:', error);
    return getMockFreeDocuments();
  }
};

// Function to get documents by category
export const getDocumentsByCategory = async (category: string) => {
  try {
    const response = await API.get(`/documents/category/${category}`);
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: !doc.is_premium
    }));
    return documents;
  } catch (error) {
    console.error('Error fetching documents by category:', error);
    throw error;
  }
};

// Function to search for documents
export const searchDocuments = async (query: string) => {
  try {
    const response = await API.get(`/documents/search?q=${query}`);
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: !doc.is_premium
    }));
    return documents;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};

// Function to get documents uploaded by the current user
export const getUserDocuments = async () => {
  try {
    const response = await API.get('/documents/my-documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }
};

// Function to get documents purchased by the current user
export const getPurchasedDocuments = async () => {
  try {
    const response = await API.get('/documents/purchased');
    return response.data;
  } catch (error) {
    console.error('Error fetching purchased documents:', error);
    throw error;
  }
};

// Function to upload a new document
export const uploadDocument = async (formData: FormData) => {
  try {
    const response = await API.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

// Function to purchase a document
export const purchaseDocument = async (documentId: string) => {
  try {
    const response = await API.post(`/documents/${documentId}/purchase`);
    return response.data;
  } catch (error) {
    console.error('Error purchasing document:', error);
    throw error;
  }
};

// Function to delete a document
export const deleteDocument = async (id: string) => {
  try {
    const response = await API.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Function to update a document
export const updateDocument = async (id: string, formData: FormData) => {
  try {
    const response = await API.put(`/documents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Function to get document statistics for the current user
export const getUserDocumentStats = async () => {
  try {
    const response = await API.get('/documents/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error;
  }
};

// Function to download a document
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
    console.error('Error downloading document:', error);
    throw error;
  }
};

// For demo, these mock functions will be used as fallbacks if API calls fail
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
  try {
    // Try to process the payment through the API
    const response = await API.post(`/documents/${documentId}/process-payment`, {
      paymentMethod
    });
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    
    // Fallback for demo
    console.log("Using mock payment processing for demo");
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      documentId,
      paymentMethod,
      transactionId: `TRANS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      amount: Math.floor(Math.random() * 100000) + 20000,
      date: new Date().toISOString()
    };
  }
};
