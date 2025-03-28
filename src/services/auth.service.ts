
import API from './api';

export interface UserData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  balance?: number;
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

export const changePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
  try {
    const response = await API.put('/users/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
