/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

import { apiClient } from './authService';

export interface OpportunityData {
  title: string;
  description: string;
  type: 'internship' | 'competition' | 'training';
  location?: string;
  deadline?: string;
  tag_ids: number[];
}

// Untuk Partner (Mitra)
export const getPartnerOpportunities = async () => {
  const response = await apiClient.get('/partner/opportunities');
  return response.data;
};

export const createOpportunity = async (data: OpportunityData) => {
  const response = await apiClient.post('/partner/opportunities', data);
  return response.data;
};

export const updateOpportunity = async (id: number, data: OpportunityData) => {
  const response = await apiClient.put(`/partner/opportunities/${id}`, data);
  return response.data;
};

export const deleteOpportunity = async (id: number) => {
  const response = await apiClient.delete(`/partner/opportunities/${id}`);
  return response.data;
};

// Untuk Admin
export const getAdminOpportunities = async () => {
  const response = await apiClient.get('/admin/opportunities');
  return response.data;
};

export const reviewOpportunity = async (id: number, status: 'approved' | 'rejected') => {
  const response = await apiClient.patch(`/admin/opportunities/${id}/review`, { status });
  return response.data;
};
