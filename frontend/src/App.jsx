import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetCode from "./pages/ResetCode";
import SetNewPassword from "./pages/SetNewPassword";

// Patient pages
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Appointments from "./pages/Appointments";
import MedicalReports from "./pages/MedicalReports";
import Profile from "./pages/Profile";

// Doctor pages (lazy — contains @react-pdf/renderer)
import { lazy, Suspense } from "react";
const GenerateReport = lazy(() => import("./pages/GenerateReport"));

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageDoctors from "./pages/ManageDoctors";
import ManagePatients from "./pages/ManagePatients";
import ManageAppointments from "./pages/ManageAppointments";
import AdminPushNotification from "./pages/AdminPushNotification";

// Notifications page
import Notifications from "./pages/Notifications";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          {/* ── Public (no sidebar) ────────────────────── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-code" element={<ResetCode />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />

          {/* ── Protected (with sidebar layout) ────────── */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route
              path="/appointments/:id/report"
              element={
                <Suspense fallback={null}>
                  <GenerateReport />
                </Suspense>
              }
            />
            <Route path="/medical-reports" element={<MedicalReports />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/notifications" element={<Notifications />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<ManageDoctors />} />
            <Route path="/admin/patients" element={<ManagePatients />} />
            <Route path="/admin/appointments" element={<ManageAppointments />} />
            <Route path="/admin/push-notifications" element={<AdminPushNotification />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
