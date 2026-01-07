import api from './axios';

export const getTasksByProject = (projectId) =>
  api.get(`/tasks/project/${projectId}`);

export const createTask = (projectId, data) =>
  api.post(`/tasks/project/${projectId}`, data);

export const updateTaskStatus = (taskId, status) =>
  api.patch(`/tasks/${taskId}/status`, { status });
