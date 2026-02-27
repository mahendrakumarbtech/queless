import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const API_URL = config.API_URL;

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      const userData = response.data.user;

      // Normalize user data - ensure role is always a string
      const normalizedUser = {
        ...userData,
        role: typeof userData.role === 'string'
          ? userData.role
          : (userData.role?.name || userData.roleName || 'customer')
      };

      setUser(normalizedUser);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;

      // Normalize user data - ensure role is always a string
      const normalizedUser = {
        ...userData,
        role: typeof userData.role === 'string'
          ? userData.role
          : (userData.role?.name || userData.roleName || 'customer')
      };

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setToken(newToken);
      setUser(normalizedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token: newToken, user: userDataResponse } = response.data;

      // Normalize user data - ensure role is always a string
      const normalizedUser = {
        ...userDataResponse,
        role: typeof userDataResponse.role === 'string'
          ? userDataResponse.role
          : (userDataResponse.role?.name || userDataResponse.roleName || 'customer')
      };

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setToken(newToken);
      setUser(normalizedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
