
import API from './api';

export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  isPremium?: boolean;
  isFeatured?: boolean;
  userId?: number;
  downloadCount?: number;
  createdAt?: string;
  updatedAt?: string;
  content?: string;
  filePath?: string;
  is_premium?: boolean;
  is_featured?: boolean;
  user_id?: number;
  download_count?: number;
  created_at?: string;
  updated_at?: string;
  file_size?: string;
  pages?: number;
  chapters?: number;
  isFree: boolean;
  previewAvailable: boolean;
}

export interface DocumentStats {
  totalUploads: number;
  totalDownloads: number;
  remainingUploads: number;
  remainingDownloads: number;
}

// Hàm chính để lấy tất cả tài liệu
export const getAllDocuments = async (): Promise<{ documents: Document[] }> => {
  try {
    const response = await API.get('/documents');
    const documents = response.data.documents.map((doc: any) => processDocument(doc));
    return { documents };
  } catch (error) {
    console.error('Error fetching all documents:', error);
    // Sử dụng dữ liệu mẫu nếu API không khả dụng
    const documents = [...getMockFreeDocuments(), ...getMockPremiumDocuments()];
    return { documents };
  }
};

// Xử lý document để đảm bảo dữ liệu nhất quán
const processDocument = (doc: any): Document => {
  // Đảm bảo trường isFree được định nghĩa dựa trên trường isPremium hoặc is_premium
  const isFree = doc.isFree !== undefined 
    ? doc.isFree 
    : doc.isPremium === false || doc.is_premium === false;

  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    category: doc.category || "Chưa phân loại",
    thumbnail: doc.thumbnail || "/placeholder.svg",
    price: doc.price || 0,
    isPremium: doc.isPremium || doc.is_premium || false,
    isFeatured: doc.isFeatured || doc.is_featured || false,
    userId: doc.userId || doc.user_id,
    downloadCount: doc.downloadCount || doc.download_count || 0,
    createdAt: doc.createdAt || doc.created_at,
    updatedAt: doc.updatedAt || doc.updated_at,
    content: doc.content,
    filePath: doc.filePath,
    is_premium: doc.is_premium || doc.isPremium || false,
    is_featured: doc.is_featured || doc.isFeatured || false,
    user_id: doc.user_id || doc.userId,
    download_count: doc.download_count || doc.downloadCount || 0,
    created_at: doc.created_at || doc.createdAt,
    updated_at: doc.updated_at || doc.updatedAt,
    file_size: doc.file_size,
    pages: doc.pages,
    chapters: doc.chapters,
    isFree: isFree,
    previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true,
  };
};

// Hàm để lấy tài liệu phổ biến
export const getFeaturedDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/featured');
    return response.data.map((doc: any) => processDocument(doc));
  } catch (error) {
    console.error('Error fetching featured documents:', error);
    // Trả về dữ liệu mẫu nếu API không khả dụng
    return getFeaturedMockDocuments();
  }
};

// Hàm để lấy tài liệu theo ID
export const getDocumentById = async (id: string): Promise<Document | null> => {
  try {
    const response = await API.get(`/documents/${id}`);
    return processDocument(response.data);
  } catch (error) {
    console.error(`Error fetching document with ID ${id}:`, error);
    
    // Tìm trong dữ liệu mẫu
    const allMockDocs = [...getMockFreeDocuments(), ...getMockPremiumDocuments()];
    const mockDoc = allMockDocs.find(d => d.id === id);
    
    if (mockDoc) {
      return mockDoc;
    }
    
    return null;
  }
};

// Hàm để lấy tài liệu theo danh mục
export const getDocumentsByCategory = async (category: string): Promise<Document[]> => {
  try {
    const response = await API.get(`/documents/category/${category}`);
    return response.data.map((doc: any) => processDocument(doc));
  } catch (error) {
    console.error(`Error fetching documents in category ${category}:`, error);
    // Lọc dữ liệu mẫu theo danh mục
    const allMockDocs = [...getMockFreeDocuments(), ...getMockPremiumDocuments()];
    return allMockDocs.filter(doc => doc.category === category);
  }
};

// Hàm tìm kiếm tài liệu
export const searchDocuments = async (query: string): Promise<Document[]> => {
  try {
    const response = await API.get(`/documents/search?q=${query}`);
    return response.data.map((doc: any) => processDocument(doc));
  } catch (error) {
    console.error('Error searching documents:', error);
    // Tìm kiếm trong dữ liệu mẫu
    const allMockDocs = [...getMockFreeDocuments(), ...getMockPremiumDocuments()];
    return allMockDocs.filter(doc => 
      doc.title.toLowerCase().includes(query.toLowerCase()) || 
      doc.description.toLowerCase().includes(query.toLowerCase()) || 
      doc.category.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Hàm lấy tài liệu cao cấp
export const getPremiumDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/premium');
    return response.data.map((doc: any) => ({
      ...processDocument(doc),
      isFree: false
    }));
  } catch (error) {
    console.error('Error fetching premium documents:', error);
    return getMockPremiumDocuments();
  }
};

// Hàm lấy tài liệu miễn phí
export const getFreeDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/free');
    return response.data.map((doc: any) => ({
      ...processDocument(doc),
      isFree: true
    }));
  } catch (error) {
    console.error('Error fetching free documents:', error);
    return getMockFreeDocuments();
  }
};

// Hàm lấy tài liệu của người dùng
export const getUserDocuments = async (userId?: number): Promise<Document[]> => {
  try {
    const endpoint = userId ? `/users/${userId}/documents` : '/documents/my-documents';
    const response = await API.get(endpoint);
    return response.data.map((doc: any) => processDocument(doc));
  } catch (error) {
    console.error(`Error fetching documents for user:`, error);
    return [];
  }
};

// Hàm lấy tài liệu đã mua
export const getPurchasedDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/purchased');
    return response.data.map((doc: any) => processDocument(doc));
  } catch (error) {
    console.error('Error fetching purchased documents:', error);
    return [];
  }
};

// Hàm kiểm tra quyền truy cập tài liệu
export const checkDocumentAccess = async (
  documentId: string
): Promise<{ hasAccess: boolean; isPurchased: boolean; isOwner: boolean }> => {
  try {
    const response = await API.get(`/documents/${documentId}/access`);
    return response.data;
  } catch (error) {
    console.error(`Error checking access for document ${documentId}:`, error);
    // Giả lập quyền truy cập cho dữ liệu mẫu
    const freeDocIds = getMockFreeDocuments().map(doc => doc.id);
    const hasAccess = freeDocIds.includes(documentId);
    return { hasAccess, isPurchased: false, isOwner: false };
  }
};

// Hàm xử lý thanh toán
export const processDocumentPayment = async (
  documentId: string,
  paymentMethod: string
): Promise<any> => {
  try {
    const response = await API.post(`/documents/${documentId}/process-payment`, {
      paymentMethod
    });
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    
    // Mô phỏng quá trình thanh toán
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

// Hàm tải xuống tài liệu
export const downloadDocument = async (documentId: string): Promise<string> => {
  try {
    const response = await API.get(`/documents/${documentId}/download`);
    return response.data.downloadUrl;
  } catch (error) {
    console.error(`Error downloading document ${documentId}:`, error);
    throw new Error('Failed to download document');
  }
};

// Hàm tải lên tài liệu mới
export const uploadDocument = async (
  formData: FormData
): Promise<Document> => {
  try {
    const response = await API.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return processDocument(response.data);
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
};

// Hàm cập nhật tài liệu
export const updateDocument = async (id: string, formData: FormData): Promise<Document> => {
  try {
    const response = await API.put(`/documents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return processDocument(response.data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error('Failed to update document');
  }
};

// Hàm xóa tài liệu
export const deleteDocument = async (id: string): Promise<any> => {
  try {
    const response = await API.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
};

// Hàm lấy thống kê tài liệu
export const getUserDocumentStats = async (): Promise<DocumentStats> => {
  try {
    const response = await API.get('/documents/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    // Trả về thống kê mẫu
    return {
      totalUploads: 5,
      totalDownloads: 25,
      remainingUploads: 15,
      remainingDownloads: 75
    };
  }
};

// Hàm lấy tài liệu mẫu cao cấp
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
      isFree: false,
      file_size: "25MB",
      pages: 120
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
      isFree: false,
      file_size: "18MB",
      pages: 85
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
      isFree: false,
      file_size: "15MB", 
      pages: 65
    }
  ];
};

// Hàm lấy tài liệu mẫu miễn phí
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
      isFree: true,
      file_size: "10MB",
      pages: 45
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
      isFree: true,
      file_size: "8MB",
      pages: 30
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
      isFree: true,
      file_size: "12MB",
      pages: 60
    }
  ];
};

// Hàm lấy tất cả tài liệu mẫu phổ biến (vừa free vừa premium)
export const getFeaturedMockDocuments = (): Document[] => {
  // Lọc các tài liệu có trường isFeatured hoặc is_featured là true
  const featuredFree = getMockFreeDocuments().filter(doc => doc.isFeatured || doc.is_featured);
  const featuredPremium = getMockPremiumDocuments().filter(doc => doc.isFeatured || doc.is_featured);
  return [...featuredFree, ...featuredPremium];
};
