import api from "./api";

export const getDoctors = () => api.get("/api/doctor");
export const getDoctorById = (id) => api.get(`/api/doctor/${id}`);
export const createDoctor = (data) => api.post("/api/doctor", data);
export const updateDoctor = (id, data) => api.put(`/api/doctor/${id}`, data);
export const deleteDoctor = (id) => api.delete(`/api/doctor/${id}`);
