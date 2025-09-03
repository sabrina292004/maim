// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.verifyToken(token).then(user => {
        setCurrentUser(user);
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      // response is the raw API shape: { status, token, data: { user } }
      const user = response?.data?.user || response?.user || null;
      const token = response?.token || null;
      if (token) localStorage.setItem('token', token);
      if (user) setCurrentUser(user);

      // normalize return shape expected by UI: { success, token, user, message }
      return {
        success: response?.status === 'success' || !!token,
        token,
        user,
        message: response?.message || null,
      };
    } catch (error) {
      // normalize thrown error into consistent shape for callers
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const user = response?.data?.user || response?.user || null;
      const token = response?.token || null;
      if (token) localStorage.setItem('token', token);
      if (user) setCurrentUser(user);

      return {
        success: response?.status === 'success' || !!token,
        token,
        user,
        message: response?.message || null,
      };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
