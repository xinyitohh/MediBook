import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

// DEV ONLY — intercept requests with mock data when using dev quick login
if (import.meta.env.DEV) {
  import("./mockApi").then(({ installMockInterceptor }) => {
    installMockInterceptor(api);
  });
}

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("medibook_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("medibook_user");
      localStorage.removeItem("medibook_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
