
import API from './api';

export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  file_path?: string;
  file_size?: number;
  thumbnail?: string;
  download_count: number;
  created_at: string;
  is_premium: boolean;
  uploader_name?: string;
  status: string;
}

export interface DocumentResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  previewAvailable: boolean;
  isPurchased?: boolean;
  relatedDocuments?: DocumentResponse[];
}

export const getAllDocuments = async () => {
  try {
    const response = await API.get('/documents');
    // Chuyển đổi dữ liệu từ backend sang format frontend
    const documents: DocumentResponse[] = response.data.map((doc: Document) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      thumbnail: doc.thumbnail || '/placeholder.svg',
      price: doc.price || 0,
      isFree: !doc.is_premium,
      previewAvailable: true // Mặc định cho phép xem trước
    }));
    return documents;
  } catch (error) {
    throw error;
  }
};

export const getDocumentById = async (id: string) => {
  try {
    const response = await API.get(`/documents/${id}`);
    
    // Kiểm tra xem người dùng đã mua tài liệu này chưa
    let isPurchased = false;
    try {
      const purchaseResponse = await API.get(`/documents/${id}/check-purchase`);
      isPurchased = purchaseResponse.data.purchased;
    } catch (err) {
      console.log("Error checking purchase status:", err);
    }
    
    // Chuyển đổi dữ liệu từ backend sang format frontend
    const document: DocumentResponse = {
      id: response.data.id,
      title: response.data.title,
      description: response.data.description,
      category: response.data.category,
      thumbnail: response.data.thumbnail || '/placeholder.svg',
      price: response.data.price || 0,
      isFree: !response.data.is_premium,
      previewAvailable: true,
      isPurchased,
      relatedDocuments: [] // Sẽ có API riêng để lấy tài liệu liên quan
    };
    
    // Lấy tài liệu liên quan (demo)
    try {
      const relatedResponse = await API.get(`/documents/related/${id}`);
      if (relatedResponse.data && relatedResponse.data.length) {
        document.relatedDocuments = relatedResponse.data.map((doc: Document) => ({
          id: doc.id,
          title: doc.title,
          description: doc.description,
          category: doc.category,
          thumbnail: doc.thumbnail || '/placeholder.svg',
          price: doc.price || 0,
          isFree: !doc.is_premium,
          previewAvailable: true
        }));
      }
    } catch (err) {
      console.log("Error fetching related documents:", err);
    }
    
    return document;
  } catch (error) {
    throw error;
  }
};

export const getFeaturedDocuments = async () => {
  try {
    const response = await API.get('/documents/featured');
    
    // Chuyển đổi dữ liệu từ backend sang format frontend
    const documents: DocumentResponse[] = response.data.map((doc: Document) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      thumbnail: doc.thumbnail || '/placeholder.svg',
      price: doc.price || 0,
      isFree: !doc.is_premium,
      previewAvailable: true
    }));
    
    return documents;
  } catch (error) {
    throw error;
  }
};

export const getDocumentsByCategory = async (category: string) => {
  try {
    const response = await API.get(`/documents/category/${category}`);
    
    // Chuyển đổi dữ liệu từ backend sang format frontend
    const documents: DocumentResponse[] = response.data.map((doc: Document) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      thumbnail: doc.thumbnail || '/placeholder.svg',
      price: doc.price || 0,
      isFree: !doc.is_premium,
      previewAvailable: true
    }));
    
    return documents;
  } catch (error) {
    throw error;
  }
};

export const searchDocuments = async (query: string) => {
  try {
    const response = await API.get(`/documents/search?q=${query}`);
    
    // Chuyển đổi dữ liệu từ backend sang format frontend
    const documents: DocumentResponse[] = response.data.map((doc: Document) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      thumbnail: doc.thumbnail || '/placeholder.svg',
      price: doc.price || 0,
      isFree: !doc.is_premium,
      previewAvailable: true
    }));
    
    return documents;
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Lấy danh sách tài liệu của người dùng hiện tại
export const getUserDocuments = async () => {
  try {
    const response = await API.get('/user/documents');
    
    // Chuyển đổi dữ liệu từ backend sang format frontend
    const documents: DocumentResponse[] = response.data.map((doc: Document) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      thumbnail: doc.thumbnail || '/placeholder.svg',
      price: doc.price || 0,
      isFree: !doc.is_premium,
      previewAvailable: true,
      isPurchased: true // Tài liệu của người dùng luôn được xem là đã mua
    }));
    
    return documents;
  } catch (error) {
    // Giả lập dữ liệu nếu API không tồn tại
    return [
      {
        id: "1",
        title: "Tài liệu luyện thi THPT Quốc Gia môn Toán",
        description: "Bộ tài liệu đầy đủ dành cho học sinh luyện thi THPT Quốc Gia môn Toán với các dạng bài tập từ cơ bản đến nâng cao.",
        category: "Giáo dục",
        thumbnail: "/placeholder.svg",
        price: 50000,
        isFree: false,
        previewAvailable: true,
        isPurchased: true
      },
      {
        id: "2",
        title: "Luật Doanh Nghiệp 2020",
        description: "Tài liệu cập nhật đầy đủ về Luật Doanh Nghiệp 2020 với các điều khoản và hướng dẫn chi tiết.",
        category: "Pháp luật",
        thumbnail: "/placeholder.svg",
        price: 0,
        isFree: true,
        previewAvailable: true,
        isPurchased: true
      },
      {
        id: "3",
        title: "Học tiếng Anh giao tiếp cơ bản",
        description: "Tài liệu giúp người học nắm vững các kỹ năng giao tiếp tiếng Anh cơ bản trong cuộc sống hàng ngày.",
        category: "Ngoại ngữ",
        thumbnail: "/placeholder.svg",
        price: 30000,
        isFree: false,
        previewAvailable: true,
        isPurchased: true
      },
      {
        id: "4",
        title: "Lập trình cơ bản với Python",
        description: "Tài liệu hướng dẫn lập trình Python từ cơ bản đến nâng cao cho người mới bắt đầu.",
        category: "Công nghệ",
        thumbnail: "/placeholder.svg",
        price: 75000,
        isFree: false,
        previewAvailable: true,
        isPurchased: true
      }
    ];
  }
};

// Mới thêm: Upload tài liệu mới
export const uploadDocument = async (documentData: FormData) => {
  try {
    const response = await API.post('/documents/upload', documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Xóa tài liệu
export const deleteDocument = async (id: string) => {
  try {
    const response = await API.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Cập nhật thông tin tài liệu
export const updateDocument = async (id: string, documentData: FormData) => {
  try {
    const response = await API.put(`/documents/${id}`, documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Download tài liệu
export const downloadDocument = async (id: string) => {
  try {
    const response = await API.get(`/documents/${id}/download`);
    
    // Trong thực tế, API sẽ trả về URL tải xuống hoặc blob dữ liệu
    // Ở đây chúng ta giả lập url tải xuống
    return {
      success: true,
      message: "Tài liệu đã được tải xuống thành công",
      download_url: `/api/documents/${id}/download?token=${Math.random().toString(36).substring(2, 9)}`,
      filename: `document-${id}.pdf`
    };
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Mua tài liệu
export const purchaseDocument = async (id: string) => {
  try {
    const response = await API.post(`/documents/${id}/purchase`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Đăng ký gói tài liệu
export const subscribePackage = async (packageId: string) => {
  try {
    const response = await API.post(`/subscriptions/subscribe`, { package_id: packageId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mới thêm: Kiểm tra trạng thái gói đăng ký
export const checkSubscriptionStatus = async () => {
  try {
    const response = await API.get('/subscriptions/status');
    return response.data;
  } catch (error) {
    // Giả lập dữ liệu nếu API không tồn tại
    return {
      isSubscribed: true,
      plan: "monthly",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      features: {
        downloadLimit: 999,
        downloadsRemaining: 980,
      }
    };
  }
};
