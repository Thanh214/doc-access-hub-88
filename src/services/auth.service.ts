
import API from './api';

export interface UserData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  balance?: number;
  bank_info?: string;
  momo_number?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface SubscriptionData {
  plan_name: string;
  price: number;
  downloads_limit: number;
  uploads_limit: number;
  max_document_price: number;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
}

export const register = async (userData: RegisterData) => {
  try {
    const response = await API.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
};

export const getCurrentUser = (): UserData | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const updateUserProfile = async (userData: Partial<UserData>) => {
  try {
    const response = await API.put('/users/update', userData);
    if (response.data.user) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAvatar = async (formData: FormData) => {
  try {
    const response = await API.post('/users/update-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.user) {
      // Cập nhật localStorage với thông tin user đầy đủ từ server
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } else if (response.data.avatar) {
      // Trường hợp cũ - chỉ cập nhật avatar
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, avatar: response.data.avatar };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalance = async () => {
  try {
    const response = await API.get('/users/balance');
    
    // Update local user data with the latest balance
    const currentUser = getCurrentUser();
    if (currentUser && response.data.balance !== undefined) {
      const updatedUser = { ...currentUser, balance: response.data.balance };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBalance = async (amount: number) => {
  try {
    const response = await API.post('/users/add-balance', { amount });
    
    // Update local user data with the new balance
    const currentUser = getCurrentUser();
    if (currentUser && response.data.balance !== undefined) {
      const updatedUser = { ...currentUser, balance: response.data.balance };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestWithdrawal = async (data: { amount: number, payment_method: 'bank_transfer' | 'momo' }) => {
  try {
    const response = await API.post('/users/withdrawal-request', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
  try {
    const response = await API.put('/users/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentInfo = async (paymentInfo: { bank_info?: string; momo_number?: string }) => {
  try {
    const response = await API.put('/users/update-payment-info', paymentInfo);
    
    if (response.data.user) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentSubscription = async (): Promise<SubscriptionData | null> => {
  try {
    const response = await API.get('/users/subscription');
    return response.data.subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

export const subscribeToPlan = async (planName: string) => {
  try {
    const response = await API.post('/subscriptions/subscribe', { plan_name: planName });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactionHistory = async () => {
  try {
    const response = await API.get('/users/transactions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWithdrawalHistory = async () => {
  try {
    const response = await API.get('/users/withdrawals');
    return response.data;
  } catch (error) {
    throw error;
  }
};
