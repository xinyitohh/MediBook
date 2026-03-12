import api from "./api.js";

export const getPatientProfile = () => api.get("/api/patient/profile");
export const updatePatientProfile = (data) =>
  api.put("/api/patient/profile", data);
