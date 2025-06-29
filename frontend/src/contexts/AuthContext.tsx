import  React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api.ts';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    if (apiService.isAuthenticated()) {
      // In a real app, you'd validate the token with the backend
      const mockUser: User = {
        email: 'user@example.com',
        username: 'User'
      };
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await apiService.login({ email, password });
    const user: User = { email, username: email.split('@')[0] };
    setUser(user);
  };

  const register = async (username: string, email: string, password: string) => {
    await apiService.register({ username, email, password });
    // Auto login after registration
    await login(email, password);
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};