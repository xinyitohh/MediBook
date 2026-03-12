import api from "./api";

export const login = (credentials) => api.post("/api/auth/login", credentials);
export const registerPatient = (data) => api.post("/api/auth/register", data);
export const registerDoctor = (data) =>
  api.post("/api/auth/register-doctor", data);
export const registerAdmin = (data) =>
  api.post("/api/auth/register-admin", data);
export const verifyEmail = (data) => api.post("/api/auth/verify-email", data);
export const resendOtp = (data) => api.post("/api/auth/resend-otp", data);
export const forgotPassword = (data) =>
  api.post("/api/auth/forgot-password", data);
export const verifyResetCode = (data) =>
  api.post("/api/auth/verify-reset-code", data);
export const resetPassword = (data) =>
  api.post("/api/auth/reset-password", data);
