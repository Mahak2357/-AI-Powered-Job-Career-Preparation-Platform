import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-powered-job-career-preparation.onrender.com",
  withCredentials: true,
});

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Register API error:", err.response?.data || err.message);
    throw err.response?.data || new Error("Registration failed");
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Login API error:", err.response?.data || err.message);
    throw err.response?.data || new Error("Login failed");
  }
}

export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");
    return response.data;
  } catch (err) {
    console.error("Logout API error:", err.response?.data || err.message);
    throw err.response?.data || new Error("Logout failed");
  }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (err) {
    console.error("GetMe API error:", err.response?.data || err.message);
    throw err.response?.data || new Error("Session expired");
  }
}