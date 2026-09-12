import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Auto-attach JWT Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

/**
 * Service to generate interview report
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData();
  
  if (jobDescription) formData.append("jobDescription", jobDescription);
  if (selfDescription) formData.append("selfDescription", selfDescription);
  if (resumeFile) formData.append("resume", resumeFile);

  try {
    const response = await api.post("/api/interview/", formData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Could not generate your preparation plan. Please try again.";
    throw new Error(message);
  }
};

/**
 * Service to get interview report by ID
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
};

export const updateRoadmapTask = async ({ interviewId, dayIndex, taskIndex, completed }) => {
  const response = await api.patch(`/api/interview/report/${interviewId}/tasks/${dayIndex}/${taskIndex}`, { completed });
  return response.data;
};

/**
 * Service to get all interview reports of logged in user
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");
  return response.data;
};

/**
 * Service to generate resume pdf
 */
export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
    responseType: "blob",
  });
  return response.data;
};