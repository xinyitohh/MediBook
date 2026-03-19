import api from "./api";

// --- REPORT DATA (GET/POST/DELETE) ---
export const getMyReports = () => api.get("/api/medical-report/my");
export const deleteReport = (id) => api.delete(`/api/medical-report/${id}`);
export const generateReport = (appointmentId, data) =>
  api.post(`/api/medical-report/generate/${appointmentId}`, data);

// --- FILE UPLOADS (FORMDATA) ---
export const uploadMedicalReport = (file, description = "") => {
  const formData = new FormData();
  formData.append("file", file);
  if (description) formData.append("description", description);
  return api.post("/api/upload/medical-report", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --- DOCTOR SPECIFIC UPLOADS ---
export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/upload/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
