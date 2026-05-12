/**
 * @module  Interest Tag
 * @desc    Layanan untuk manajemen interest tag
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

import { apiClient } from './authService';

/**
 * Mengambil daftar semua tag (Admin)
 */
export const getTags = async () => {
  const response = await apiClient.get('/admin/tags');
  return response.data;
};

/**
 * Membuat tag baru (Admin)
 */
export const createTag = async (data: { name: string }) => {
  const response = await apiClient.post('/admin/tags', data);
  return response.data;
};

/**
 * Memperbarui tag (Admin)
 */
export const updateTag = async (id: number, data: { name: string }) => {
  const response = await apiClient.put(`/admin/tags/${id}`, data);
  return response.data;
};

/**
 * Menghapus tag (Admin)
 */
export const deleteTag = async (id: number) => {
  const response = await apiClient.delete(`/admin/tags/${id}`);
  return response.data;
};

/**
 * Mengambil daftar tag yang tersedia untuk publik/mahasiswa
 */
export const getAvailableTags = async () => {
  const response = await apiClient.get('/tags/public');
  return response.data;
};

/**
 * Sinkronisasi tag minat mahasiswa
 */
export const syncStudentTags = async (tagIds: number[]) => {
  const response = await apiClient.post('/student/tags/sync', { tag_ids: tagIds });
  return response.data;
};

/**
 * Alias untuk getAvailableTags (Backward compatibility)
 */
export const getPublicTags = getAvailableTags;

export default {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getAvailableTags,
  getPublicTags,
  syncStudentTags
};
