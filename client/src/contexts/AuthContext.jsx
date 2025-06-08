import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api'; // Import the apiClient

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Initialize with null, useEffect will load from localStorage
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    const storedUserJson = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
      if (storedUserJson) {
        try {
          setUser(JSON.parse(storedUserJson));
        } catch (e) {
          console.error("Error parsing stored user:", e);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
      setToken(null);
      delete apiClient.defaults.headers.common['Authorization'];
    }

    setIsLoading(false); // Loading done
  }, []);

  const login = (userData, userToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
