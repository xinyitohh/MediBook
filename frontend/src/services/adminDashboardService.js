import api from "./api.js";

export const getAdminStats = () => api.get("/api/admindashboard/stats");
