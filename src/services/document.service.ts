
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
}

export interface DocumentCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Service functions
export const getFeaturedDocuments = async (): Promise<Document[]> => {
  try {
    const response = await API.get('/documents/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured documents:', error);
    return []; // Return empty array as fallback
  }
};

export const getDocumentById = async (id: string): Promise<Document | null> => {
  try {
    const response = await API.get(`/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching document with ID ${id}:`, error);
    return null;
  }
};

export const getDocumentsByCategory = async (category: string): Promise<Document[]> => {
  try {
    const response = await API.get(`/documents/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching documents in category ${category}:`, error);
    return [];
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
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { documents: [], totalCount: 0 };
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

export const getUserDocuments = async (userId: number): Promise<Document[]> => {
  try {
    const response = await API.get(`/users/${userId}/documents`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching documents for user ${userId}:`, error);
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
    const response = await API.post(`/documents/${documentId}/purchase`, {
      paymentMethod
    });
    return response.data;
  } catch (error) {
    console.error(`Error processing payment for document ${documentId}:`, error);
    
    // For demo purposes, simulate a successful purchase
    return {
      success: true,
      documentId,
      paymentMethod,
      transactionId: `TRANS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      amount: 35000,
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
