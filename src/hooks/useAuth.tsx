
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getCurrentUser, isAuthenticated } from '@/services/auth.service';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initAuth = () => {
      const currentUser = getCurrentUser();
      const isUserAuthenticated = isAuthenticated();
      
      setUser(currentUser);
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  const value = {
    user,
    isAuthenticated: !!user,
    loading
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
