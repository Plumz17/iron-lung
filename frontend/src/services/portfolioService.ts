/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

import { apiClient } from './authService';

export const getPortfolios = async () => {
  const response = await apiClient.get('/student/portfolios');
  return response.data;
};

export const createPortfolio = async (data: any, imageFile?: File) => {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.project_url) formData.append('project_url', data.project_url);
  if (imageFile) formData.append('image_file', imageFile);

  const response = await apiClient.post('/student/portfolios', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updatePortfolio = async (id: number, data: any, imageFile?: File) => {
  const formData = new FormData();
  // Karena method form data sulit menggunakan PUT di Laravel PHP jika ada file
  // Kita kirim via POST dengan method spoofing
  formData.append('_method', 'PUT'); 
  
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.project_url) formData.append('project_url', data.project_url);
  if (imageFile) formData.append('image_file', imageFile);

  const response = await apiClient.post(`/student/portfolios/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deletePortfolio = async (id: number) => {
  const response = await apiClient.delete(`/student/portfolios/${id}`);
  return response.data;
};
