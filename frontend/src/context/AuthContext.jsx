import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(null);

  // Check for session_id in URL fragment on mount
  useEffect(() => {
    const handleAuth = async () => {
      const hash = window.location.hash;
      
      if (hash && hash.includes('session_id=')) {
        // Extract session_id from URL fragment
        const sessionId = hash.split('session_id=')[1].split('&')[0];
        
        try {
          setLoading(true);
          
          // Exchange session_id for user data
          const response = await axios.post(`${API}/auth/session`, {
            session_id: sessionId
          }, {
            withCredentials: true
          });
          
          setUser(response.data.user);
          setSessionToken(response.data.session_token);
          
          // Clean URL fragment
          window.history.replaceState(null, '', window.location.pathname);
        } catch (error) {
          console.error('Session exchange failed:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Check for existing session
        checkExistingSession();
      }
    };

    handleAuth();
  }, []);

  const checkExistingSession = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      // No existing session
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    const authUrl = process.env.REACT_APP_AUTH_URL || 'https://auth.emergentagent.com';
    window.location.href = `${authUrl}/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, {
        withCredentials: true
      });
      setUser(null);
      setSessionToken(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    sessionToken,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};