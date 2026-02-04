import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
// 1. IMPORT YOUR CONFIG FILE HERE
import backendUrl from '../config.js'; 

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set default axios header if token exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  // LOGIN FUNCTION
  const login = async (username, password) => {
    try {
      // 2. USE THE BACKEND URL HERE
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        username,
        password
      });

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, isAdmin: response.data.user?.role === 'admin' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
