import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from '../utils/notifications';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOADING':
      return { ...state, loading: true };
    case 'ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user: JSON.parse(user) },
      });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const login = async (email) => {
    dispatch({ type: 'LOADING' });
    try {
      // Mock API - replace with real
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email,
        skillsOffered: ['React', 'Tailwind'],
        skillsWanted: ['Node.js', 'Python'],
      };
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token },
      });
      toast.success('Login successful!');
  } catch (error) {
      dispatch({ type: 'ERROR', payload: 'Login failed' });
      console.error('Login error:', error);
    }
  };

  const signup = async (name, email) => {
    dispatch({ type: 'LOADING' });
    try {
      const mockUser = {
        id: Date.now(),
        name,
        email,
        skillsOffered: [],
        skillsWanted: [],
      };
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token },
      });
      console.log('Signup successful!');
    } catch (error) {
      dispatch({ type: 'ERROR', payload: 'Signup failed' });
      console.error('Signup error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    console.log('Logged out');
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


