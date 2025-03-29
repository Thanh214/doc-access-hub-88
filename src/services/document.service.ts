
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
  is_premium?: boolean;
  is_featured?: boolean;
  user_id?: number;
  download_count?: number;
  created_at?: string;
  updated_at?: string;
  content?: string;
}

// Lấy tất cả tài liệu
export const getAllDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents');
    
    // Đảm bảo dữ liệu trả về đúng định dạng
    const documents = response.data.map((doc: any) => ({
      id: doc.id.toString(),
      title: doc.title,
      description: doc.description || "Mô tả tài liệu này chưa được cập nhật.",
      category: doc.category || "Chưa phân loại",
      thumbnail: doc.thumbnail || "/placeholder.svg",
      price: doc.price || 0,
      isFree: doc.price === 0 || doc.is_free === true,
      previewAvailable: doc.preview_available !== false,
      is_premium: doc.is_premium || false,
      is_featured: doc.is_featured || false,
      user_id: doc.user_id,
      download_count: doc.download_count || 0,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    }));
    
    return documents;
  } catch (error) {
    console.error('Lỗi khi lấy tài liệu:', error);
    
    // Trả về dữ liệu mẫu trong trường hợp lỗi
    return getMockDocuments();
  }
};

// Lấy tài liệu nổi bật 
export const getFeaturedDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/featured');
    
    // Đảm bảo dữ liệu trả về đúng định dạng
    const documents = response.data.map((doc: any) => ({
      id: doc.id.toString(),
      title: doc.title,
      description: doc.description || "Mô tả tài liệu này chưa được cập nhật.",
      category: doc.category || "Chưa phân loại",
      thumbnail: doc.thumbnail || "/placeholder.svg",
      price: doc.price || 0,
      isFree: doc.price === 0 || doc.is_free === true,
      previewAvailable: doc.preview_available !== false,
      is_premium: doc.is_premium || false,
      is_featured: doc.is_featured || true,
      user_id: doc.user_id,
      download_count: doc.download_count || 0,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    }));
    
    return documents;
  } catch (error) {
    console.error('Lỗi khi lấy tài liệu nổi bật:', error);
    
    // Lọc tài liệu nổi bật từ dữ liệu mẫu
    const mockDocs = getMockDocuments();
    return mockDocs.filter(doc => doc.is_featured);
  }
};

// Lấy tài liệu theo id
export const getDocumentById = async (id: string): Promise<Document | null> => {
  try {
    const response = await API.get(`/documents/${id}`);
    const doc = response.data;
    
    return {
      id: doc.id.toString(),
      title: doc.title,
      description: doc.description || "Mô tả tài liệu này chưa được cập nhật.",
      category: doc.category || "Chưa phân loại",
      thumbnail: doc.thumbnail || "/placeholder.svg",
      price: doc.price || 0,
      isFree: doc.price === 0 || doc.is_free === true,
      previewAvailable: doc.preview_available !== false,
      content: doc.content,
      is_premium: doc.is_premium || false,
      is_featured: doc.is_featured || false,
      user_id: doc.user_id,
      download_count: doc.download_count || 0,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    };
  } catch (error) {
    console.error(`Lỗi khi lấy tài liệu ID ${id}:`, error);
    
    // Tìm tài liệu theo ID từ dữ liệu mẫu
    const mockDocs = getMockDocuments();
    return mockDocs.find(doc => doc.id === id) || null;
  }
};

// Lấy tài liệu theo danh mục
export const getDocumentsByCategory = async (category: string): Promise<Document[]> => {
  try {
    const response = await API.get(`/documents/category/${category}`);
    
    // Đảm bảo dữ liệu trả về đúng định dạng
    const documents = response.data.map((doc: any) => ({
      id: doc.id.toString(),
      title: doc.title,
      description: doc.description || "Mô tả tài liệu này chưa được cập nhật.",
      category: doc.category || "Chưa phân loại",
      thumbnail: doc.thumbnail || "/placeholder.svg",
      price: doc.price || 0,
      isFree: doc.price === 0 || doc.is_free === true,
      previewAvailable: doc.preview_available !== false,
      is_premium: doc.is_premium || false,
      is_featured: doc.is_featured || false,
      user_id: doc.user_id,
      download_count: doc.download_count || 0,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    }));
    
    return documents;
  } catch (error) {
    console.error(`Lỗi khi lấy tài liệu danh mục ${category}:`, error);
    
    // Lọc tài liệu theo danh mục từ dữ liệu mẫu
    const mockDocs = getMockDocuments();
    return mockDocs.filter(doc => doc.category.toLowerCase() === category.toLowerCase());
  }
};

// Xử lý thanh toán tài liệu
export const processDocumentPayment = async (docId: string, paymentMethod: string) => {
  try {
    const response = await API.post('/payments/document', { document_id: docId, payment_method: paymentMethod });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xử lý thanh toán:', error);
    
    // Trả về kết quả giả cho mục đích demo
    return {
      success: true,
      message: 'Thanh toán thành công (mô phỏng)',
      transaction_id: `TR-${Date.now()}`,
      document_id: docId,
      amount: 0, // Sẽ được điền đúng giá trị trong thực tế
      payment_method: paymentMethod,
      payment_date: new Date().toISOString()
    };
  }
};

// Lấy tài liệu của người dùng hiện tại
export const getUserDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/user/documents');
    
    // Đảm bảo dữ liệu trả về đúng định dạng
    const documents = response.data.map((doc: any) => ({
      id: doc.id.toString(),
      title: doc.title,
      description: doc.description || "Mô tả tài liệu này chưa được cập nhật.",
      category: doc.category || "Chưa phân loại",
      thumbnail: doc.thumbnail || "/placeholder.svg",
      price: doc.price || 0,
      isFree: doc.price === 0 || doc.is_free === true,
      previewAvailable: doc.preview_available !== false,
      is_premium: doc.is_premium || false,
      is_featured: doc.is_featured || false,
      user_id: doc.user_id,
      download_count: doc.download_count || 0,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    }));
    
    return documents;
  } catch (error) {
    console.error('Lỗi khi lấy tài liệu của người dùng:', error);
    
    // Trả về một số tài liệu mẫu
    return getMockDocuments().slice(0, 2);
  }
};

// Dữ liệu mẫu để sử dụng khi API chưa hoàn thiện
const getMockDocuments = (): Document[] => {
  return [
    {
      id: "1",
      title: "Giáo Trình Tiếng Anh Giao Tiếp Cơ Bản",
      description: "Giáo trình tiếng Anh cơ bản dành cho người mới bắt đầu, tập trung vào giao tiếp hàng ngày và ngữ pháp cơ bản.",
      category: "Ngoại Ngữ",
      thumbnail: "https://via.placeholder.com/400x300?text=English+Course",
      price: 0,
      isFree: true,
      previewAvailable: true,
      is_featured: true,
      download_count: 1245
    },
    {
      id: "2",
      title: "Sách Giáo Khoa Toán Học Lớp 12",
      description: "Sách giáo khoa Toán học dành cho học sinh lớp 12, bao gồm đầy đủ các chương trình theo chuẩn của Bộ Giáo Dục.",
      category: "Giáo Dục",
      thumbnail: "https://via.placeholder.com/400x300?text=Math+Textbook",
      price: 15000,
      isFree: false,
      previewAvailable: true,
      download_count: 867
    },
    {
      id: "3",
      title: "Hướng Dẫn Lập Trình Python Cho Người Mới Bắt Đầu",
      description: "Tài liệu hướng dẫn lập trình Python từ cơ bản đến nâng cao dành cho người mới bắt đầu, với nhiều ví dụ thực tế.",
      category: "Công Nghệ",
      thumbnail: "https://via.placeholder.com/400x300?text=Python+Programming",
      price: 50000,
      isFree: false,
      previewAvailable: true,
      is_premium: true,
      is_featured: true,
      download_count: 2341
    },
    {
      id: "4",
      title: "Ebook - 101 Công Thức Nấu Ăn Chay",
      description: "Sách điện tử với 101 công thức nấu ăn chay đơn giản, bổ dưỡng và dễ thực hiện tại nhà.",
      category: "Ẩm Thực",
      thumbnail: "https://via.placeholder.com/400x300?text=Vegetarian+Cookbook",
      price: 25000,
      isFree: false,
      previewAvailable: true,
      download_count: 634
    },
    {
      id: "5",
      title: "Báo Cáo Thị Trường Bất Động Sản 2023",
      description: "Báo cáo phân tích chi tiết về thị trường bất động sản Việt Nam năm 2023, xu hướng và dự báo cho năm 2024.",
      category: "Kinh Doanh",
      thumbnail: "https://via.placeholder.com/400x300?text=Real+Estate+Report",
      price: 120000,
      isFree: false,
      previewAvailable: false,
      is_premium: true,
      download_count: 189
    },
    {
      id: "6",
      title: "Tài Liệu Y Khoa - Cẩm Nang Sơ Cứu",
      description: "Cẩm nang hướng dẫn sơ cứu cơ bản trong các tình huống khẩn cấp, được biên soạn bởi các chuyên gia y tế.",
      category: "Y Tế",
      thumbnail: "https://via.placeholder.com/400x300?text=First+Aid+Guide",
      price: 0,
      isFree: true,
      previewAvailable: true,
      is_featured: true,
      download_count: 3245
    }
  ];
};
