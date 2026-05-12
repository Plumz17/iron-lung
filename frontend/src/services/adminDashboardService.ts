/**
 * @module  Admin Dashboard
 * @desc    Layanan untuk memanggil API statistik admin
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

import { apiClient } from './authService';

export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard/stats');
  return response.data;
};
