import api from "./api.js";

export const submitReview = (data) => api.post("/api/review", data);
export const getDoctorReviews = (doctorId) =>
  api.get(`/api/review/doctor/${doctorId}`);
