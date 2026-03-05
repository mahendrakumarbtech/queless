import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config/config';

const AuthContext = createContext();

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_USER_KEY = 'admin_user';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Per-request auth: admin API uses admin_token, rest use token (dual session in same browser)
axios.interceptors.request.use((req) => {
  const url = req.url || '';
  const isAdminApi = url.includes('/api/admin/') || url.includes('/admin/');
  const token = isAdminApi ? localStorage.getItem(ADMIN_TOKEN_KEY) : localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

function normalizeUser(userData) {
  if (!userData) return null;
  return {
    ...userData,
    role: typeof userData.role === 'string'
      ? userData.role
      : (userData.role?.name || userData.roleName || 'customer')
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem(ADMIN_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem(ADMIN_TOKEN_KEY));

  const API_URL = config.API_URL;

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(normalizeUser(response.data.user));
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const fetchAdminUser = useCallback(async () => {
    const t = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!t) {
      setAdminLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      const normalized = normalizeUser(response.data.user);
      setAdminUser(normalized);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(normalized));
    } catch (error) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      setAdminToken(null);
      setAdminUser(null);
    } finally {
      setAdminLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  useEffect(() => {
    if (adminToken) {
      fetchAdminUser();
    } else {
      setAdminLoading(false);
    }
  }, [adminToken, fetchAdminUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      const normalizedUser = normalizeUser(userData);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setToken(newToken);
      setUser(normalizedUser);

      return { success: true, user: normalizedUser };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      const normalizedUser = normalizeUser(userData);

      const role = normalizedUser?.role || '';
      if (role !== 'admin' && role !== 'staff') {
        return {
          success: false,
          message: 'Only admin or staff can sign in here. Use the main site to sign in as provider.'
        };
      }

      localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(normalizedUser));
      setAdminToken(newToken);
      setAdminUser(normalizedUser);

      return { success: true, user: normalizedUser };
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
      const normalizedUser = normalizeUser(userDataResponse);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setToken(newToken);
      setUser(normalizedUser);

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
  };

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setAdminToken(null);
    setAdminUser(null);
  };

  const value = {
    user,
    adminUser,
    loading,
    adminLoading,
    token,
    adminToken,
    login,
    loginAdmin,
    register,
    logout,
    logoutAdmin,
    isAuthenticated: !!user,
    isAdminAuthenticated: !!adminUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
