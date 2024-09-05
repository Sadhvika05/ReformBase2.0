import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const expirationTime = localStorage.getItem('tokenExpirationTime');
    if (token && expirationTime && new Date().getTime() < expirationTime) {
      setIsAuthenticated(true);
      fetchUser();
      setTimeout(() => {
        logout();
      }, expirationTime - new Date().getTime());
    } else {
      logout();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/auth/user');
      console.log('Fetched user:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };

  const login = (token) => {
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpirationTime', expirationTime);
    setIsAuthenticated(true);
    fetchUser();
    setTimeout(() => {
      logout();
    }, 60 * 60 * 1000); // 1 hour
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpirationTime');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
