import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, profileApi, AuthUser } from '@/services/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string, age?: number, gender?: string) => Promise<void>;
  logoutUser: () => void;
  getUserProfile: (id: string) => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('burnmate-user');
    const token = localStorage.getItem('burnmate-token');
    if (savedUser && token) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('burnmate-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('burnmate-user');
    }
  }, [user]);

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token, user } = await authApi.login({ email, password });
      localStorage.setItem('burnmate-token', token);
      localStorage.setItem('burnmate-user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      setIsLoading(false);
      throw error; // Re-throw the error so the component can handle it
    }
    setIsLoading(false);
  };

  const registerUser = async (name: string, email: string, password: string, age?: number, gender?: string) => {
    setIsLoading(true);
    try {
      const { token, user } = await authApi.register({ name, email, password, age, gender });
      localStorage.setItem('burnmate-token', token);
      localStorage.setItem('burnmate-user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      setIsLoading(false);
      throw error; // Re-throw the error so the component can handle it
    }
    setIsLoading(false);
  };

  const logoutUser = () => {
    localStorage.removeItem('burnmate-token');
    localStorage.removeItem('burnmate-user');
    setUser(null);
  };

  const getUserProfile = async (id: string) => {
    try {
      const profile = await profileApi.getProfile(id);
      setUser(profile);
      localStorage.setItem('burnmate-user', JSON.stringify(profile));
      return profile;
    } catch {
      return null;
    }
  };

  const value = {
    user,
    isLoading,
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};