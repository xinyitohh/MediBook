import api from "./api";

export const getDoctorProfile = () => api.get("/api/doctor/profile");
export const updateDoctorProfile = (data) =>
  api.put("/api/doctor/profile", data);
export const deleteDoctor = (id) => api.delete(`/api/doctor/${id}`);
export const getAllDoctors = () => api.get("/api/doctor");
export const getDoctorById = (id) => api.get(`/api/doctor/${id}`);
export const updateDoctor = (id, data) => api.put(`/api/doctor/${id}`, data);
export const getAvailableSlots = (id, date) =>
  api.get(`/api/doctor/${id}/slots?date=${date}`);
export const adminRegisterDoctor = (data) => api.post('/api/doctor/admin-register', data);
export const resendDoctorSetupLink = (id) => api.post(`/api/doctor/${id}/resend-setup`);
export const getDoctorSchedule = () => api.get('/api/doctor/schedule');
export const updateDoctorSchedule = (schedules) => api.put('/api/doctor/schedule', { schedules });