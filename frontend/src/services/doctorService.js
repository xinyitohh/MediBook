import api from "./api";

export const getDoctorProfile = () => api.get("/api/doctor/profile");
export const updateDoctorProfile = (data) =>
  api.put("/api/doctor/profile", data);
export const deleteDoctor = (id) => api.delete(`/api/doctor/${id}`);
export const getAllDoctors = () => api.get("/api/doctor");
export const getDoctorById = (id) => api.get(`/api/doctor/${id}`);
export const getAvailableSlots = (id, date) =>
  api.get(`/api/doctor/${id}/slots?date=${date}`);
