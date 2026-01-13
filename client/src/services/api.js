import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {
                        withCredentials: true,
                    },
                );

                const { accessToken } = response.data.data;
                localStorage.setItem("accessToken", accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

// Auth API
export const authAPI = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    logout: () => api.post("/auth/logout"),
    getCurrentUser: () => api.get("/auth/current-user"),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
    forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
    resetPassword: (token, newPassword) =>
        api.post(`/auth/reset-forgot-password/${token}`, { newPassword }),
    changePassword: (oldPassword, newPassword) =>
        api.post("/auth/change-password", { oldPassword, newPassword }),
    resendVerificationEmail: () => api.post("/auth/resend-verification-email"),
    getUserById: (userId) => api.get(`/auth/user/${userId}`),
    getUsersByIds: (userIds) => api.post("/auth/users", { userIds }),
};

// Projects API
export const projectsAPI = {
    create: (data) => api.post("/projects/create-project", data),
    getAll: () => api.get("/projects/get-projects"),
    getOne: (projectId) => api.get(`/projects/${projectId}/get-project`),
    update: (projectId, data) =>
        api.put(`/projects/${projectId}/update-project`, data),
    delete: (projectId) => api.delete(`/projects/${projectId}/delete-project`),
    getMembers: (projectId) => api.get(`/projects/${projectId}/get-members`),
    addMember: (projectId, data) =>
        api.post(`/projects/${projectId}/add-member`, data),
    updateMemberRole: (projectId, memberId, role) =>
        api.patch(`/projects/${projectId}/update-member-role/${memberId}`, {
            role,
        }),
    deleteMember: (projectId, memberId) =>
        api.delete(`/projects/${projectId}/remove-member/${memberId}`),
};

// Tasks API
export const tasksAPI = {
    create: (projectId, data) =>
        api.post(`/tasks/${projectId}/create-task`, data),
    getAll: (projectId) => api.get(`/tasks/${projectId}/get-tasks`),
    getOne: (projectId, taskId) =>
        api.get(`/tasks/${projectId}/${taskId}/get-task-details`),
    update: (projectId, taskId, data) =>
        api.put(`/tasks/${projectId}/${taskId}/update-task`, data),
    updateStatus: (projectId, taskId, status) =>
        api.patch(`/tasks/${projectId}/${taskId}/update-status`, { status }),
    delete: (projectId, taskId) =>
        api.delete(`/tasks/${projectId}/${taskId}/delete-task`),
};

// Risks API
export const risksAPI = {
    getProjectHealth: (projectId) =>
        api.get(`/risks/${projectId}/get-project-health`),
    getTimeline: (projectId, params = {}) =>
        api.get(`/risks/${projectId}/get-timeline`, { params }),
    getTopRiskTasks: (projectId, top = 5) =>
        api.get(`/risks/${projectId}/get-top-risk-tasks`, { params: { top } }),
    getProjectRisks: (projectId, params = {}) =>
        api.get(`/risks/${projectId}/get-project-risks`, { params }),
    getTaskRisks: (taskId) => api.get(`/risks/tasks/${taskId}/get-task-risks`),
    resolveRisk: (riskId) => api.put(`/risks/${riskId}/resolve-risk`),
};

// Insights API
export const insightsAPI = {
    getProjectInsight: (projectId) => api.get(`/insights/${projectId}`),
};

export default api;
