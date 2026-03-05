/**
 * ──────────────────────────────────────────────
 *  DEV-ONLY mock API interceptor.
 *
 *  Activated ONLY when:
 *    1. import.meta.env.DEV === true
 *    2. The stored token is "dev-fake-token"
 *
 *  Intercepts Axios requests and returns fake
 *  data from mockData.js.  Never hits any real
 *  server or database.
 * ──────────────────────────────────────────────
 */
import {
  MOCK_DOCTORS,
  MOCK_APPOINTMENTS,
  MOCK_DOCTOR_APPOINTMENTS,
  MOCK_REPORTS,
  MOCK_TIME_SLOTS,
} from "./mockData";

/** Helper – build a fake Axios response */
const fakeResponse = (data, status = 200) =>
  Promise.resolve({ data, status, statusText: "OK", headers: {}, config: {} });

/** Check if we're in dev-mock mode */
const isDevMock = () =>
  localStorage.getItem("medibook_token") === "dev-fake-token";

/** Get current dev user's role */
const getDevRole = () => {
  try {
    return JSON.parse(localStorage.getItem("medibook_user") || "{}").role;
  } catch {
    return null;
  }
};

/**
 * Install a request interceptor on the given Axios instance.
 * When in dev-mock mode, matching routes return fake data
 * instead of making a real HTTP call.
 */
export function installMockInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use((config) => {
    // Only intercept when using a dev-fake-token
    if (!isDevMock()) return config;

    const url = config.url || "";
    const method = (config.method || "get").toLowerCase();

    // ── GET routes ────────────────────────────
    if (method === "get") {
      // My appointments
      if (url === "/api/appointment/my") {
        const role = getDevRole();
        const data =
          role === "Doctor" ? MOCK_DOCTOR_APPOINTMENTS : MOCK_APPOINTMENTS;
        return Promise.reject({ __mockResponse: fakeResponse(data) });
      }

      // All appointments (admin)
      if (url === "/api/appointment/all") {
        return Promise.reject({
          __mockResponse: fakeResponse([
            ...MOCK_APPOINTMENTS,
            ...MOCK_DOCTOR_APPOINTMENTS,
          ]),
        });
      }

      // Doctor list
      if (url === "/api/doctor") {
        return Promise.reject({ __mockResponse: fakeResponse(MOCK_DOCTORS) });
      }

      // Doctor by id
      const doctorMatch = url.match(/^\/api\/doctor\/(\d+)$/);
      if (doctorMatch) {
        const doc = MOCK_DOCTORS.find((d) => d.id === parseInt(doctorMatch[1]));
        if (doc) return Promise.reject({ __mockResponse: fakeResponse(doc) });
      }

      // Doctor slots
      const slotsMatch = url.match(/^\/api\/doctor\/\d+\/slots$/);
      if (slotsMatch) {
        // Return a randomised subset to simulate availability
        const shuffled = [...MOCK_TIME_SLOTS].sort(() => 0.5 - Math.random());
        const available = shuffled.slice(0, 6 + Math.floor(Math.random() * 4));
        available.sort((a, b) => a.localeCompare(b));
        return Promise.reject({ __mockResponse: fakeResponse(available) });
      }

      // Medical reports
      if (url === "/api/medical-report/my") {
        return Promise.reject({ __mockResponse: fakeResponse(MOCK_REPORTS) });
      }
    }

    // ── POST routes ───────────────────────────
    if (method === "post") {
      // Book appointment
      if (url === "/api/appointment") {
        const newAppt = {
          id: Date.now(),
          doctor:
            MOCK_DOCTORS.find((d) => d.id === config.data?.doctorId)
              ?.fullName || "Unknown Doctor",
          patient: "Sarah Johnson",
          specialty:
            MOCK_DOCTORS.find((d) => d.id === config.data?.doctorId)
              ?.specialty || "General",
          date: config.data?.appointmentDate || "2026-03-15",
          time: config.data?.timeSlot || "09:00 AM",
          status: "Pending",
          notes: config.data?.notes || "",
        };
        return Promise.reject({
          __mockResponse: fakeResponse({
            message: "Appointment booked!",
            appointment: newAppt,
          }),
        });
      }

      // Upload medical report
      if (url === "/api/upload/medical-report") {
        return Promise.reject({
          __mockResponse: fakeResponse({ message: "Report uploaded (mock)" }),
        });
      }

      // Upload profile image
      if (url === "/api/upload/profile-image") {
        return Promise.reject({
          __mockResponse: fakeResponse({ message: "Image uploaded (mock)" }),
        });
      }

      // Generate medical report
      const genReportMatch = url.match(
        /^\/api\/medical-report\/generate\/\d+$/,
      );
      if (genReportMatch) {
        return Promise.reject({
          __mockResponse: fakeResponse({ message: "Report generated (mock)" }),
        });
      }
    }

    // ── PUT routes ────────────────────────────
    if (method === "put") {
      const cancelMatch = url.match(/^\/api\/appointment\/(\d+)\/cancel$/);
      if (cancelMatch) {
        return Promise.reject({
          __mockResponse: fakeResponse({
            message: "Appointment cancelled (mock)",
          }),
        });
      }

      const confirmMatch = url.match(/^\/api\/appointment\/(\d+)\/confirm$/);
      if (confirmMatch) {
        return Promise.reject({
          __mockResponse: fakeResponse({
            message: "Appointment confirmed (mock)",
          }),
        });
      }

      const completeMatch = url.match(/^\/api\/appointment\/(\d+)\/complete$/);
      if (completeMatch) {
        return Promise.reject({
          __mockResponse: fakeResponse({
            message: "Appointment completed (mock)",
          }),
        });
      }

      // Doctor profile update
      if (url === "/api/doctor/profile") {
        return Promise.reject({
          __mockResponse: fakeResponse({ message: "Profile updated (mock)" }),
        });
      }

      // Doctor availability update
      if (url === "/api/doctor/availability") {
        return Promise.reject({
          __mockResponse: fakeResponse({
            message: "Availability updated (mock)",
          }),
        });
      }
    }

    // ── DELETE routes ─────────────────────────
    if (method === "delete") {
      const deleteReportMatch = url.match(/^\/api\/medical-report\/\d+$/);
      if (deleteReportMatch) {
        return Promise.reject({
          __mockResponse: fakeResponse({ message: "Report deleted (mock)" }),
        });
      }
    }

    // Not matched → let it go through to real server
    return config;
  });

  // Response interceptor: unwrap our mock responses
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If this is one of our mock rejections, resolve it normally
      if (error?.__mockResponse) {
        return error.__mockResponse;
      }
      // Otherwise propagate the real error
      return Promise.reject(error);
    },
  );
}
