import api from "./api";

// --- REPORT DATA (GET/POST/DELETE) ---
export const getMyReports = () => api.get("/api/medical-report/my");
export const deleteReport = (id) => api.delete(`/api/medical-report/${id}`);
export const generateReport = (appointmentId, data) =>
  api.post(`/api/medical-report/generate/${appointmentId}`, data);

// --- FILE UPLOADS (FORMDATA) ---
export const uploadMedicalReport = (file, description = "", onProgressCallback) => {
    const formData = new FormData();
    formData.append("file", file);
    if (description) formData.append("description", description);

    return api.post("/api/upload/medical-report", formData, {
        headers: { "Content-Type": "multipart/form-data" },

        onUploadProgress: (progressEvent) => {
            // Calculate the percentage
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

            // If the component provided a callback, send the number back to it
            if (onProgressCallback) {
                onProgressCallback(percentCompleted);
            }
        },
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
