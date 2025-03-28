
import API from './api';

// Types
export interface Document {
  id: string;
  title: string;
  description: string;
  content?: string;
  filePath?: string;
  userId: number;
  isFeatured: boolean;
  isPremium: boolean;
  category: string;
  price: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  isFree?: boolean;
  previewAvailable: boolean; // Make this required with a default value
  is_premium?: boolean;
  is_featured?: boolean;
  user_id?: number;
  download_count?: number;
  created_at?: string;
  updated_at?: string;
  file_size?: string;
  pages?: number;
  chapters?: number;
}

export interface DocumentCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface DocumentStats {
  totalUploads: number;
  totalDownloads: number;
  remainingUploads: number;
  remainingDownloads: number;
}

// Function to get all documents
export const getAllDocuments = async (): Promise<{ documents: Document[] }> => {
  try {
    const response = await API.get('/documents');
    const documents = response.data.documents.map((doc: Document) => ({
      ...doc,
      isFree: doc.isFree !== undefined ? doc.isFree : !doc.isPremium && !doc.is_premium,
      previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
      thumbnail: doc.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    }));
    return { documents };
  } catch (error) {
    console.error('Error fetching all documents:', error);
    // Fallback to getDocuments if API fails
    const { documents } = await getDocuments();
    return { documents };
  }
};

// Service functions
export const getFeaturedDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/featured');
    return response.data.map((doc: Document) => ({
      ...doc,
      isFree: doc.isFree !== undefined ? doc.isFree : !(doc.isPremium || doc.is_premium),
      previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
      thumbnail: doc.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    }));
  } catch (error) {
    console.error('Error fetching featured documents:', error);
    // Return documents that have isFeatured = true
    const { documents } = await getDocuments(1, 100, { isFeatured: true });
    return documents;
  }
};

export const getDocumentById = async (id: string): Promise<Document | null> => {
  try {
    const response = await API.get(`/documents/${id}`);
    return {
      ...response.data,
      isFree: response.data.isFree !== undefined ? response.data.isFree : !(response.data.isPremium || response.data.is_premium),
      previewAvailable: response.data.previewAvailable !== undefined ? response.data.previewAvailable : true,
      thumbnail: response.data.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    };
  } catch (error) {
    console.error(`Error fetching document with ID ${id}:`, error);
    
    // For demo purposes, try to get from mock data
    console.log("Falling back to mock data for demo");
    const allMockDocs = [...getMockFreeDocuments(), ...getMockPremiumDocuments()];
    const mockDoc = allMockDocs.find(d => d.id === id);
    
    if (mockDoc) {
      return mockDoc;
    }
    
    return null;
  }
};

export const getDocumentsByCategory = async (category: string): Promise<Document[]> => {
  try {
    const response = await API.get(`/documents/category/${category}`);
    return response.data.map((doc: Document) => ({
      ...doc,
      isFree: doc.isFree !== undefined ? doc.isFree : !(doc.isPremium || doc.is_premium),
      previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
      thumbnail: doc.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    }));
  } catch (error) {
    console.error(`Error fetching documents in category ${category}:`, error);
    // Return documents that match the category
    const { documents } = await getDocuments(1, 100, { category });
    return documents;
  }
};

// Function to search for documents
export const searchDocuments = async (query: string): Promise<Document[]> => {
  try {
    const response = await API.get(`/documents/search?q=${query}`);
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: doc.isFree !== undefined ? doc.isFree : !(doc.isPremium || doc.is_premium),
      previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
      thumbnail: doc.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    }));
    return documents;
  } catch (error) {
    console.error('Error searching documents:', error);
    // Try to filter existing documents based on title or description containing the query
    const { documents } = await getDocuments();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(query.toLowerCase()) || 
      doc.description.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export const getDocuments = async (
  page = 1,
  limit = 10,
  filters?: {
    category?: string;
    isPremium?: boolean;
    isFeatured?: boolean;
    search?: string;
  }
): Promise<{ documents: Document[]; totalCount: number }> => {
  try {
    let url = `/documents?page=${page}&limit=${limit}`;
    
    if (filters) {
      if (filters.category) url += `&category=${filters.category}`;
      if (filters.isPremium !== undefined) url += `&isPremium=${filters.isPremium}`;
      if (filters.isFeatured !== undefined) url += `&isFeatured=${filters.isFeatured}`;
      if (filters.search) url += `&search=${filters.search}`;
    }
    
    const response = await API.get(url);
    const documents = response.data.documents.map((doc: Document) => ({
      ...doc,
      isFree: doc.isFree !== undefined ? doc.isFree : !(doc.isPremium || doc.is_premium),
      previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
      thumbnail: doc.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    }));
    
    return { documents, totalCount: response.data.totalCount || documents.length };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { 
      documents: [...getMockFreeDocuments(), ...getMockPremiumDocuments()], 
      totalCount: 6 
    };
  }
};

export const getCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const response = await API.get('/documents/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Function to get premium documents
export const getPremiumDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/premium');
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: false,
      previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
      thumbnail: doc.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    }));
    return documents;
  } catch (error) {
    console.error('Error fetching premium documents:', error);
    // Fallback to getDocuments with isPremium filter
    const { documents } = await getDocuments(1, 100, { isPremium: true });
    if (documents.length > 0) {
      return documents;
    }
    return getMockPremiumDocuments();
  }
};

// Function to get free documents
export const getFreeDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/free');
    const documents = response.data.map((doc: Document) => ({
      ...doc,
      isFree: true,
      previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
      thumbnail: doc.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    }));
    return documents;
  } catch (error) {
    console.error('Error fetching free documents:', error);
    // Fallback to getDocuments with isPremium=false filter
    const { documents } = await getDocuments(1, 100, { isPremium: false });
    if (documents.length > 0) {
      return documents;
    }
    return getMockFreeDocuments();
  }
};

export const getUserDocuments = async (userId?: number): Promise<Document[]> => {
  try {
    const endpoint = userId ? `/users/${userId}/documents` : '/documents/my-documents';
    const response = await API.get(endpoint);
    return response.data.map((doc: Document) => ({
      ...doc,
      isFree: doc.isFree !== undefined ? doc.isFree : !(doc.isPremium || doc.is_premium),
      previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
      thumbnail: doc.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    }));
  } catch (error) {
    console.error(`Error fetching documents for user:`, error);
    return [];
  }
};

export const getPurchasedDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/purchased');
    return response.data.map((doc: Document) => ({
      ...doc,
      isFree: false, // Purchased documents are not free (they were paid for)
      previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
      thumbnail: doc.thumbnail || "/placeholder.svg" // Ensure thumbnail is always set
    }));
  } catch (error) {
    console.error('Error fetching purchased documents:', error);
    return [];
  }
};

export const checkDocumentAccess = async (
  documentId: string
): Promise<{ hasAccess: boolean; isPurchased: boolean; isOwner: boolean }> => {
  try {
    const response = await API.get(`/documents/${documentId}/access`);
    return response.data;
  } catch (error) {
    console.error(`Error checking access for document ${documentId}:`, error);
    return { hasAccess: false, isPurchased: false, isOwner: false };
  }
};

export const processDocumentPayment = async (
  documentId: string,
  paymentMethod: string
): Promise<any> => {
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

export const downloadDocument = async (documentId: string): Promise<string> => {
  try {
    const response = await API.get(`/documents/${documentId}/download`);
    return response.data.downloadUrl;
  } catch (error) {
    console.error(`Error downloading document ${documentId}:`, error);
    throw new Error('Failed to download document');
  }
};

// Export function to handle document upload
export const uploadDocument = async (
  formData: FormData
): Promise<Document> => {
  try {
    const response = await API.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
};

// Function to update a document
export const updateDocument = async (id: string, formData: FormData): Promise<Document> => {
  try {
    const response = await API.put(`/documents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error('Failed to update document');
  }
};

// Function to delete a document
export const deleteDocument = async (id: string): Promise<any> => {
  try {
    const response = await API.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
};

// Function to get document statistics for the current user
export const getUserDocumentStats = async (): Promise<DocumentStats> => {
  try {
    const response = await API.get('/documents/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    // Return mock stats
    return {
      totalUploads: 5,
      totalDownloads: 25,
      remainingUploads: 15,
      remainingDownloads: 75
    };
  }
};

// Mock data functions for testing and fallbacks
export const getMockPremiumDocuments = (): Document[] => {
  return [
    {
      id: "premium-doc-1",
      title: "Khóa Học Toàn Diện về Machine Learning",
      description: "Tài liệu chuyên sâu về machine learning với các thuật toán, ứng dụng thực tế và nghiên cứu mới nhất.",
      category: "Công Nghệ",
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3",
      price: 90000,
      isPremium: true,
      is_premium: true,
      isFeatured: true,
      is_featured: true,
      userId: 1,
      user_id: 1,
      previewAvailable: true,
      downloadCount: 150,
      download_count: 150,
      createdAt: "2023-08-10",
      created_at: "2023-08-10",
      updatedAt: "2023-08-10",
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
      isPremium: true,
      is_premium: true,
      isFeatured: false,
      is_featured: false,
      userId: 1,
      user_id: 1,
      previewAvailable: true,
      downloadCount: 85,
      download_count: 85,
      createdAt: "2023-07-25",
      created_at: "2023-07-25",
      updatedAt: "2023-07-25",
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
      isPremium: true,
      is_premium: true,
      isFeatured: true,
      is_featured: true,
      userId: 1,
      user_id: 1,
      previewAvailable: true,
      downloadCount: 210,
      download_count: 210,
      createdAt: "2023-06-05",
      created_at: "2023-06-05",
      updatedAt: "2023-06-05",
      updated_at: "2023-06-05",
      isFree: false
    }
  ];
};

export const getMockFreeDocuments = (): Document[] => {
  return [
    {
      id: "free-doc-1",
      title: "Giáo Trình Lập Trình Cơ Bản",
      description: "Tài liệu cơ bản về lập trình cho người mới bắt đầu, giới thiệu các khái niệm và ngôn ngữ phổ biến.",
      category: "Lập Trình",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3",
      price: 0,
      isPremium: false,
      is_premium: false,
      isFeatured: true,
      is_featured: true,
      userId: 1,
      user_id: 1,
      previewAvailable: true,
      downloadCount: 320,
      download_count: 320,
      createdAt: "2023-06-15",
      created_at: "2023-06-15",
      updatedAt: "2023-06-15",
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
      isPremium: false,
      is_premium: false,
      isFeatured: false,
      is_featured: false,
      userId: 1,
      user_id: 1,
      previewAvailable: true,
      downloadCount: 250,
      download_count: 250,
      createdAt: "2023-07-10",
      created_at: "2023-07-10",
      updatedAt: "2023-07-10",
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
      isPremium: false,
      is_premium: false,
      isFeatured: true,
      is_featured: true,
      userId: 1,
      user_id: 1,
      previewAvailable: true,
      downloadCount: 420,
      download_count: 420,
      createdAt: "2023-05-25",
      created_at: "2023-05-25",
      updatedAt: "2023-05-25",
      updated_at: "2023-05-25",
      isFree: true
    }
  ];
};
