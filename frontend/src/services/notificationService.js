import api from "./api";

export const getNotifications = () => api.get("/api/notification");
export const getUnreadCount = () => api.get("/api/notification/unread-count");
export const markNotificationRead = (id) =>
  api.put(`/api/notification/${id}/read`);
export const markAllNotificationsRead = () =>
  api.put("/api/notification/read-all");
export const deleteNotification = (id) =>
  api.delete(`/api/notification/${id}`);
export const deleteAllNotifications = () =>
  api.delete("/api/notification/all");
