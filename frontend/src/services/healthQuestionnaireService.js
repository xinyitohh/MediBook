import api from "./api";

export const submitQuestionnaire = (data) =>
  api.post("/api/healthquestionnaire", data);
export const getQuestionnaire = (appointmentId) =>
  api.get(`/api/healthquestionnaire/appointment/${appointmentId}`);
