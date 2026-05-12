/**
 * @module  User Management
 * @desc    Modul pengelolaan pengguna oleh Admin (CRUD)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

import { apiClient } from './authService';

/**
 * Mengambil daftar pengguna (Admin only)
 * @param {number} page
 * @returns {Promise<any>}
 */
export const getUsers = async (page: number = 1) => {
  const response = await apiClient.get(`/users?page=${page}`);
  return response.data;
};

/**
 * Membuat pengguna baru
 * @param {Object} data 
 * @returns {Promise<any>}
 */
export const createUser = async (data: any) => {
  const response = await apiClient.post('/users', data);
  return response.data;
};

/**
 * Mengubah data pengguna
 * @param {number} id 
 * @param {Object} data 
 * @returns {Promise<any>}
 */
export const updateUser = async (id: number, data: any) => {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
};

/**
 * Menghapus pengguna
 * @param {number} id 
 * @returns {Promise<any>}
 */
export const deleteUser = async (id: number) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export default {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
