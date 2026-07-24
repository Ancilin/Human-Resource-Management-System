import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hrms_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse saved user from localStorage:', e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('hrms_token') || null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('hrms_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('hrms_theme', theme);
    } catch (e) {
      console.warn('LocalStorage error setting theme:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    let isMounted = true;
    async function initAuth() {
      if (token) {
        try {
          const res = await api.getMe();
          if (isMounted && res && res.user) {
            setUser(res.user);
            localStorage.setItem('hrms_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('initAuth error, performing fallback logout:', err);
          if (isMounted) {
            logout();
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    }
    initAuth();
    return () => { isMounted = false; };
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login for', email);
      const res = await api.login({ email, password });
      console.log('AuthContext: API login response success:', { hasToken: !!res?.token, user: res?.user });
      
      if (res && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('hrms_token', res.token);
        localStorage.setItem('hrms_user', JSON.stringify(res.user));

        const displayName = res.user.name || (res.user.employee && res.user.employee.name) || res.user.email || 'User';
        showToast(`Welcome back, ${displayName}!`, 'success');
        return res;
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (err) {
      console.error('AuthContext: login function failed:', err);
      showToast(err.message || 'Login failed', 'danger');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('hrms_token');
      localStorage.removeItem('hrms_user');
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }
    showToast('Logged out successfully.', 'info');
  };

  const updateUserProfile = (employeeData) => {
    if (user) {
      const updatedUser = { ...user, name: employeeData.name || user.name, employee: employeeData };
      setUser(updatedUser);
      try {
        localStorage.setItem('hrms_user', JSON.stringify(updatedUser));
      } catch (e) {
        console.warn('Failed to save updated profile:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        theme,
        toast,
        toggleTheme,
        showToast,
        login,
        logout,
        updateUserProfile,
        isHR: user?.role === 'HR',
        isEmployee: user?.role === 'EMPLOYEE' || user?.role === 'Employee'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext) || {};
}
