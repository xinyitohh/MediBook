import api from "./api";

export const bookAppointment = (data) => api.post("/api/appointment", data);
export const getMyAppointments = () => api.get("/api/appointment/my");
export const cancelAppointment = (id) => api.put(`/api/appointment/${id}/cancel`);
export const confirmAppointment = (id) => api.put(`/api/appointment/${id}/confirm`);
export const completeAppointment = (id, notes) =>
  api.put(`/api/appointment/${id}/complete`, { doctorNotes: notes });
export const getAllAppointments = (params) =>
  api.get("/api/appointment/all", { params });
