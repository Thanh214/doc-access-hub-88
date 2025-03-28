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
