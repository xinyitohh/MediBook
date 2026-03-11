import api from "./api";

export const generateMedicalReport = (appointmentId, data) =>
  api.post(`/api/medical-report/generate/${appointmentId}`, data);
