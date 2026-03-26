import api from "./api";

export const bookAppointment = (data) => api.post("/api/appointment", data);
export const getMyAppointments = () => api.get("/api/appointment/my");
export const cancelAppointment = (id) =>
  api.put(`/api/appointment/${id}/cancel`);
export const confirmAppointment = (id) =>
  api.put(`/api/appointment/${id}/confirm`);
export const completeAppointment = (id, data) =>
  api.put(`/api/appointment/${id}/complete`, data);
export const getAllAppointments = () => api.get("/api/appointment/all");
export const searchAppointments = (params) => {
  // params could be { doctorId: 1 } or { patientId: 5 } or { doctorId: 1, patientId: 5 }
  return api.get("/api/appointment/search", { params });
};
