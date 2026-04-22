import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiCall, API } from '../config/api';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string, phone: string, city?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  signOut: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on page load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── SIGN UP → calls POST /api/auth/signup on Spring Boot
  const signUp = async (email: string, password: string, name: string, phone: string, city?: string) => {
    try {
      const response = await apiCall(API.auth.signup, {
        method: 'POST',
        body: JSON.stringify({ email, password, name, phone, city }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || 'Sign up failed' };
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Failed to create account' };
    }
  };

  // ── SIGN IN → calls POST /api/auth/signin on Spring Boot
  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiCall(API.auth.signin, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || 'Sign in failed' };

      // Save JWT token + user to localStorage
      setAccessToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to sign in' };
    }
  };

  // ── SIGN OUT → clears everything
  const signOut = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      isLoading,
      signUp,
      signIn,
      signOut,
      isAuthenticated: !!user && !!accessToken,
      isAdmin: user?.is_admin || false,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
