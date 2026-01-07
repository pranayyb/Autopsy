import api from "./axios";
export const getTimeline = (projectId) =>
  api.get(`/risks/${projectId}/timeline`);

export const getInsights = (projectId) => api.get(`/insights/${projectId}`);
