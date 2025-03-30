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
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeaturedDocuments = async () => {
  try {
    const response = await API.get('/documents/featured');
    // Map the response to include isFree and previewAvailable properties
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

export const getUserDocuments = async () => {
  try {
    const response = await API.get('/user/documents');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadDocument = async (documentData: FormData) => {
  try {
    const response = await API.post('/documents/upload', documentData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
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

export const updateDocument = async (id: string, documentData: FormData) => {
  try {
    const response = await API.put(`/documents/${id}`, documentData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadDocument = async (id: string) => {
  try {
    const response = await API.get(`/documents/download/${id}`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    // Lấy tên file từ Content-Disposition header hoặc dùng tên mặc định
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '') 
      : `document-${id}.pdf`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const getDocumentPreview = async (id: string) => {
  try {
    const response = await API.get(`/documents/${id}/preview`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkDownloadEligibility = async (id: string) => {
  try {
    const response = await API.get(`/documents/${id}/check-eligibility`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentSubscription = async () => {
  try {
    const response = await API.get('/subscriptions/current');
    return response.data;
  } catch (error) {
    throw error;
  }
};
