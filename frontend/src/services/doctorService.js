import api from "./api";

export const getDoctors = (params) => api.get("/api/doctor", { params });
export const getDoctorById = (id) => api.get(`/api/doctor/${id}`);
export const getDoctorSlots = (id, date) =>
  api.get(`/api/doctor/${id}/slots`, { params: { date } });
export const updateDoctorProfile = (data) => api.put("/api/doctor/profile", data);
export const updateAvailability = (data) => api.put("/api/doctor/availability", data);
