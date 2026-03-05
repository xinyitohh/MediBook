import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Stethoscope,
  Calendar,
  FileText,
  User,
  Activity,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  ChevronRight,
} from "lucide-react";

/* ── Menu config per role ────────────────────────────── */
const menuConfig = {
  Patient: [
    { to: "/",              label: "Home",             icon: Home },
    { to: "/doctors",       label: "Find Doctors",     icon: Stethoscope },
    { to: "/appointments",  label: "My Appointments",  icon: Calendar },
    { to: "/medical-reports", label: "Medical Reports", icon: FileText },
    { to: "/profile",       label: "My Profile",       icon: User },
  ],
  Doctor: [
    { to: "/",              label: "Dashboard",        icon: Home },
    { to: "/appointments",  label: "My Schedule",      icon: Calendar },
    { to: "/profile",       label: "My Profile",       icon: User },
  ],
  Admin: [
    { to: "/admin",         label: "Dashboard",        icon: Activity },
    { to: "/admin/doctors", label: "Manage Doctors",   icon: Stethoscope },
    { to: "/admin/patients",label: "Manage Patients",  icon: Users },
    { to: "/appointments",  label: "Appointments",     icon: Calendar },
    { to: "/profile",       label: "Profile",          icon: User },
  ],
  SuperAdmin: [
    { to: "/admin",         label: "Dashboard",        icon: Activity },
    { to: "/admin/doctors", label: "Manage Doctors",   icon: Stethoscope },
    { to: "/admin/patients",label: "Manage Patients",  icon: Users },
    { to: "/admin/admins",  label: "Manage Admins",    icon: Users },
    { to: "/settings",      label: "System Config",    icon: Settings },
    { to: "/profile",       label: "Profile",          icon: User },
  ],
};

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "Patient";
  const links = menuConfig[role] || menuConfig.Patient;

  // Initials for avatar
  const initials = (user?.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <aside
      className={`
        relative flex flex-col h-screen bg-sidebar text-white sticky top-0
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[260px]"}
      `}
    >
      {/* ── Expand toggle (floating outside, only when collapsed) ── */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute -right-3.5 top-7 z-20 w-7 h-7 rounded-lg bg-white/[0.08] backdrop-blur-md border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/15 transition-colors shadow-lg"
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/* ── Logo bar ─────────────────────────────────── */}
      <div className={`flex items-center gap-3 py-5 border-b border-white/[0.06] ${collapsed ? "justify-center px-3" : "px-5"}`}>
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-brand-500 to-mint-500 flex items-center justify-center font-extrabold text-sm shrink-0">
          M
        </div>
        {!collapsed && (
          <>
            <span className="font-bold text-lg tracking-tight flex-1">MediBook</span>
            <button
              onClick={() => setCollapsed(true)}
              className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/15 transition-colors shrink-0"
            >
              <ChevronLeft size={14} />
            </button>
          </>
        )}
      </div>

      {/* ── Nav links ────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            {role}
          </p>
        )}

        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[10px] text-sm transition-all duration-150
                ${collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"}
                ${
                  isActive
                    ? "bg-gradient-to-r from-brand-500/20 to-mint-500/10 text-white font-semibold"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* ── User card ────────────────────────────────── */}
      <div className="px-3 pb-4">
        {collapsed ? (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2.5 text-gray-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04]">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName}</p>
              <p className="text-[11px] text-gray-500">{role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
