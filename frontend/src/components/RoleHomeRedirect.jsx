import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";

function isAdminUser(user) {
  if (!user) {
    return false;
  }

  const candidates = [
    user.role,
    user.Role,
    user.userRole,
    user.roleName,
    Array.isArray(user.roles) ? user.roles[0] : user.roles,
  ]
    .flat()
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return candidates.some((role) => role.includes("admin"));
}

export default function RoleHomeRedirect() {
  const { user } = useAuth();

  if (isAdminUser(user)) {
    return <Navigate to="/admin" replace />;
  }

  return <Home />;
}
