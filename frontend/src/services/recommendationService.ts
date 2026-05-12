/**
 * @module  Recommendation
 * @desc    Layanan untuk rekomendasi peluang
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

import { apiClient } from './authService';

export const getRecommendations = async () => {
  const response = await apiClient.get('/student/recommendations');
  return response.data;
};
