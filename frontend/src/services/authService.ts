/**
 * @module  Auth
 * @desc    Modul autentikasi dan otorisasi pengguna (JWT + RBAC)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

import axios from 'axios';
import { getAccessToken, setAccessToken, removeAccessToken } from '../utils/tokenHandler';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Konfigurasi default axios
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Untuk mengirim/menerima httpOnly cookie (refresh token)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor untuk menyisipkan Access Token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk menangani token expired (Refresh otomatis)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Jika error 401 dan belum pernah di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Coba refresh token
        const res = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        
        if (res.data?.data?.access_token) {
          setAccessToken(res.data.data.access_token);
          originalRequest.headers.Authorization = `Bearer ${res.data.data.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Jika refresh token gagal/expired, paksa logout
        removeAccessToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Melakukan proses login
 * @param {Object} credentials - Email dan password
 * @returns {Promise<any>} Response dari API
 */
export const login = async (credentials: any) => {
  const response = await apiClient.post('/auth/login', credentials);
  if (response.data?.data?.access_token) {
    setAccessToken(response.data.data.access_token);
  }
  return response.data;
};

/**
 * Melakukan proses registrasi
 * @param {Object} data - Data registrasi (email, password, role_id, dll)
 * @returns {Promise<any>} Response dari API
 */
export const register = async (data: any) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

/**
 * Melakukan proses logout
 * @returns {Promise<any>} Response dari API
 */
export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    removeAccessToken();
    return response.data;
  } catch (error) {
    removeAccessToken();
    throw error;
  }
};

/**
 * Melakukan proses change password
 * @param {Object} data - Password baru
 * @returns {Promise<any>} Response dari API
 */
export const changePassword = async (data: { new_password: string }) => {
  const response = await apiClient.post('/auth/change-password', data);
  return response.data;
};

/**
 * Mengambil profil user yang sedang login
 * @returns {Promise<any>} Response dari API
 */
export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export { apiClient };

export default {
  login,
  register,
  logout,
  changePassword,
  getMe,
  apiClient
};
