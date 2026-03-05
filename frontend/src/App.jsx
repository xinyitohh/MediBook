import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Patient pages
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Appointments from "./pages/Appointments";
import MedicalReports from "./pages/MedicalReports";
import Profile from "./pages/Profile";

// Doctor pages
import GenerateReport from "./pages/GenerateReport";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public (no sidebar) ────────────────────── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
            <Route path="/appointments/:id/report" element={<GenerateReport />} />
            <Route path="/medical-reports" element={<MedicalReports />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
