/**
 * @module  Recommendation
 * @desc    Layanan untuk manajemen tag
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

import { apiClient } from './authService';

export const getPublicTags = async () => {
  const response = await apiClient.get('/tags/public');
  return response.data;
};
