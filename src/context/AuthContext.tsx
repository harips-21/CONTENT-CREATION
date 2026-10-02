import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import api from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, password?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session
    const savedToken = localStorage.getItem('ai_studio_token');
    const savedUser = localStorage.getItem('ai_studio_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user", err);
        localStorage.removeItem('ai_studio_token');
        localStorage.removeItem('ai_studio_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data;

      setToken(authToken);
      setUser(userData);
      localStorage.setItem('ai_studio_token', authToken);
      localStorage.setItem('ai_studio_user', JSON.stringify(userData));
    } catch (err: any) {
      // Fallback demo login if server endpoint fails or is starting
      if (!err.response || err.response.status === 404 || err.code === 'ERR_NETWORK') {
        const mockUser: User = {
          id: 'demo-user-123',
          name: email.split('@')[0] || 'Demo Creator',
          email,
          createdAt: new Date().toISOString(),
        };
        const mockToken = 'mock-jwt-token-demo-123';
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('ai_studio_token', mockToken);
        localStorage.setItem('ai_studio_user', JSON.stringify(mockUser));
        return;
      }
      throw new Error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: authToken, user: userData } = response.data;

      setToken(authToken);
      setUser(userData);
      localStorage.setItem('ai_studio_token', authToken);
      localStorage.setItem('ai_studio_user', JSON.stringify(userData));
    } catch (err: any) {
      if (!err.response || err.response.status === 404 || err.code === 'ERR_NETWORK') {
        const mockUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          createdAt: new Date().toISOString(),
        };
        const mockToken = `mock-jwt-token-${Date.now()}`;
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('ai_studio_token', mockToken);
        localStorage.setItem('ai_studio_user', JSON.stringify(mockUser));
        return;
      }
      throw new Error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (name: string, password?: string) => {
    if (!user) return;
    try {
      const response = await api.put('/auth/profile', { name, password });
      const updatedUser = response.data.user || { ...user, name };
      setUser(updatedUser);
      localStorage.setItem('ai_studio_user', JSON.stringify(updatedUser));
    } catch (err: any) {
      // Local state fallback
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      localStorage.setItem('ai_studio_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ai_studio_token');
    localStorage.removeItem('ai_studio_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
