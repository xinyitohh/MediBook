import api from "./api";

export const uploadMedicalReport = (file, description = "") => {
  const formData = new FormData();
  formData.append("file", file);
  if (description) formData.append("description", description);
  return api.post("/api/upload/medical-report", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/upload/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getMyReports = () => api.get("/api/medical-report/my");
export const deleteReport = (id) => api.delete(`/api/medical-report/${id}`);

