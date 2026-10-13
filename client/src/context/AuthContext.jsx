import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('timetrade_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('timetrade_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback((showToast = false) => {
    localStorage.removeItem('timetrade_token');
    localStorage.removeItem('timetrade_user');
    setUser(null);
    setToken(null);
    if (showToast) {
      toast.success('Signed out successfully');
    }
  }, []);

  // Listen for global 401 unauthorized logout event
  useEffect(() => {
    const handleAuthLogout = () => {
      logout(false);
      toast.error('Session expired. Please sign in again.');
    };
    window.addEventListener('timetrade_auth_logout', handleAuthLogout);
    return () => window.removeEventListener('timetrade_auth_logout', handleAuthLogout);
  }, [logout]);

  // Validate session on app initialization
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('timetrade_token');
      if (savedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('timetrade_user', JSON.stringify(res.data.user));
          }
        } catch {
          // Token is invalid or expired
          logout(false);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [logout]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    localStorage.setItem('timetrade_token', receivedToken);
    localStorage.setItem('timetrade_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    toast.success(`Welcome back, ${receivedUser.name}!`);
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const { token: receivedToken, user: receivedUser } = res.data;

    localStorage.setItem('timetrade_token', receivedToken);
    localStorage.setItem('timetrade_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    toast.success(`Welcome to TimeTrade, ${receivedUser.name}!`);
    return receivedUser;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('timetrade_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
