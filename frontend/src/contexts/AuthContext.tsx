import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { User, AuthResponse } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post<{ data: AuthResponse }>('/auth/login', {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data.data;

      await AsyncStorage.multiSet([
        ['user', JSON.stringify(user)],
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
      ]);

      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const response = await api.post<{ data: AuthResponse }>('/auth/register', data);

      const { user, accessToken, refreshToken } = response.data.data;

      await AsyncStorage.multiSet([
        ['user', JSON.stringify(user)],
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
      ]);

      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al registrarse');
    }
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
