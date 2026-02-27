import api from "./api";

export const getMyAppointments = () => api.get("/api/appointment");
export const getAllAppointments = () => api.get("/api/appointment/all");
export const bookAppointment = (data) => api.post("/api/appointment", data);
export const cancelAppointment = (id) =>
  api.put(`/api/appointment/${id}/cancel`);
export const confirmAppointment = (id) =>
  api.put(`/api/appointment/${id}/confirm`);
