import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api'; // Import the apiClient

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Initialize with null, useEffect will load from localStorage

  useEffect(() => {
    const storedUserJson = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken); // Set token state
      if (storedUserJson) {
        try {
          setUser(JSON.parse(storedUserJson)); // Set user state
        } catch (e) {
          console.error("Error parsing stored user:", e);
          localStorage.removeItem('user'); // Clear inconsistent storage
          setUser(null);
        }
      } else {
        // If token exists but no user, might be a partial state, clear user
        setUser(null);
      }
    } else {
      // No token, ensure user is also cleared and no auth header
      setUser(null);
      setToken(null);
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, []); // Runs once on mount to load initial state from localStorage

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
    // Optionally, redirect or perform other cleanup
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { // Check for undefined, as null is a valid initial context value
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
