/**
 * @module  Project
 * @desc    Modul proyek kolaborasi
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

import { apiClient } from './authService';

export const getProjects = async () => {
  const response = await apiClient.get('/student/projects');
  return response.data;
};

export const createProject = async (data: { title: string, description: string, max_members: number }) => {
  const response = await apiClient.post('/student/projects', data);
  return response.data;
};

export const joinProject = async (projectId: number) => {
  const response = await apiClient.post(`/student/projects/${projectId}/join`);
  return response.data;
};
