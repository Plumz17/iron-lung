/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

import { apiClient } from './authService';

// Mahasiswa
export const getAvailableOpportunities = async () => {
  const response = await apiClient.get('/student/opportunities');
  return response.data;
};

export const getMyApplications = async () => {
  const response = await apiClient.get('/student/applications');
  return response.data;
};

export const applyToOpportunity = async (opportunityId: number, coverLetter: string) => {
  const response = await apiClient.post(`/student/opportunities/${opportunityId}/apply`, {
    cover_letter: coverLetter
  });
  return response.data;
};

// Mitra
export const getOpportunityApplicants = async (opportunityId: number) => {
  const response = await apiClient.get(`/partner/opportunities/${opportunityId}/applications`);
  return response.data;
};

export const reviewApplication = async (applicationId: number, status: 'under_review' | 'accepted' | 'rejected') => {
  const response = await apiClient.patch(`/partner/applications/${applicationId}/review`, { status });
  return response.data;
};
