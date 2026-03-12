import api from "./api.js";

export const getActiveAnnouncements = () => api.get("/api/announcement/active");
export const createAnnouncement = (data) => api.post("/api/announcement", data);
