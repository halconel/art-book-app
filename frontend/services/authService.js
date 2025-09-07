import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.yourdomain.com'
    : window.location.origin;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = Cookies.get('auth_token');
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      Cookies.remove('user_role');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;
    Cookies.set('auth_token', token, { expires: 7 });
    Cookies.set('user_role', user.role, { expires: 7 });

    return { token, user };
  },

  async register(userData) {
    const response = await api.post('/auth/register', {
      user: userData,
    });

    const { token, user } = response.data;
    Cookies.set('auth_token', token, { expires: 7 });
    Cookies.set('user_role', user.role, { expires: 7 });

    return { token, user };
  },

  async getCurrentUser() {
    const token = Cookies.get('auth_token');
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      authService.logout();
      return null;
    }
  },

  logout() {
    Cookies.remove('auth_token');
    Cookies.remove('user_role');
    window.location.href = '/#/login';
  },

  getToken() {
    return Cookies.get('auth_token');
  },

  getUserRole() {
    return Cookies.get('user_role');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    return this.getUserRole() === 'admin';
  },

  isClient() {
    return this.getUserRole() === 'client';
  },
};

export default api;
