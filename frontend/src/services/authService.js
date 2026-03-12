import api from "./api";

export const login = (credentials) => api.post("/api/auth/login", credentials);
export const registerPatient = (data) => api.post("/api/auth/register", data);
export const registerDoctor = (data) =>
  api.post("/api/auth/register-doctor", data);
export const registerAdmin = (data) =>
  api.post("/api/auth/register-admin", data);
