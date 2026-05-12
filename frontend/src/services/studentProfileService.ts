/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

import { apiClient } from './authService';

/**
 * Mendapatkan profil mahasiswa
 */
export const getProfile = async () => {
  const response = await apiClient.get('/student/profile');
  return response.data;
};

/**
 * Memperbarui profil teks
 */
export const updateProfile = async (data: any) => {
  const response = await apiClient.put('/student/profile', data);
  return response.data;
};

/**
 * Mengunggah CV
 */
export const uploadCv = async (file: File) => {
  const formData = new FormData();
  formData.append('cv_file', file);

  const response = await apiClient.post('/student/profile/cv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
