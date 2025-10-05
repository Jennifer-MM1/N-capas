import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarAuth();
  }, []);

  const verificarAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await api.get('/auth/perfil');
        setUsuario(data.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.data.token);
    setUsuario(data.data);
    return data;
  };

  const registro = async (datosUsuario) => {
    const { data } = await api.post('/auth/registro', datosUsuario);
    localStorage.setItem('token', data.data.token);
    setUsuario(data.data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, registro, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};