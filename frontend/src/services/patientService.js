import api from "./api.js";

export const getPatientProfile = () => api.get("/api/patient/profile");
export const getPatientProfileById = (id) => api.get(`/api/patient/${id}`);
export const updatePatientProfile = (data) =>
  api.put("/api/patient/profile", data);
export const deletePatient = (id) => api.delete(`/api/patient/${id}`);
export const getAllPatients = () => api.get("/api/patient/all");
export const adminRegisterPatient = (data) => api.post("/api/patient/admin-register", data);
export const adminUpdatePatient = (id, data) => api.put(`/api/patient/${id}`, data);
export const resendPatientSetupLink = (id) => api.post(`/api/patient/${id}/resend-setup`);