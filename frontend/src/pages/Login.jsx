import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  Shield,
  Calendar,
  Clock,
} from "lucide-react";
import { login } from "../services";
import { useAuth } from "../context/AuthContext";

function getDefaultRouteForUser(userData) {
  const roleCandidates = [
    userData?.role,
    userData?.Role,
    userData?.userRole,
    userData?.roleName,
    Array.isArray(userData?.roles) ? userData.roles[0] : userData?.roles,
  ]
    .flat()
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  if (roleCandidates.some((role) => role.includes("admin"))) {
    return "/admin";
  }

  return "/";
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.verified) {
      setSuccessMsg("Email verified! You can now sign in.");
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUnverified(false);
    try {
      const res = await login(form);
      const { token, ...userData } = res.data;
      loginUser(userData, token);
      navigate(getDefaultRouteForUser(userData));
    } catch (err) {
      if (err.response?.status === 403) {
        setUnverified(true);
      } else {
        setError(
          err.response?.data?.message || "Login failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ──────────────────────── */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-sidebar via-[#1a2744] to-brand-700 flex-col justify-center items-center px-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-500/[0.07] blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-mint-500/[0.06] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/[0.04] blur-2xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-lg w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-mint-500 flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-brand-500/25">
              M
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              MediBook
            </span>
          </div>

          <h1 className="text-white text-[52px] font-extrabold leading-[1.1] tracking-tight mb-5">
            Your Health,
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-mint-400 bg-clip-text text-transparent">
              Our Priority.
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Book appointments with top doctors, manage your medical records, and
            receive instant notifications — all in one platform.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { icon: Calendar, text: "Easy Scheduling" },
              { icon: Shield, text: "Secure Records" },
              { icon: Heart, text: "Quality Care" },
              { icon: Clock, text: "24/7 Support" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm"
              >
                <Icon size={14} className="text-mint-400" />
                <span className="text-gray-300 text-sm font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-12">
            {[
              { num: "500+", label: "Doctors" },
              { num: "50K+", label: "Patients" },
              { num: "4.9", label: "Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white text-[32px] font-extrabold">{s.num}</p>
                <p className="text-gray-500 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div className="mt-12 p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
            <p className="text-gray-300 text-sm leading-relaxed italic">
              "MediBook made it incredibly easy to find the right specialist and
              book an appointment. Will give A+ for sure!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-mint-400 flex items-center justify-center text-white text-xs font-bold">
                WL
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Wei Liang</p>
                <p className="text-gray-500 text-xs">Patient since 2026</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right login form ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-mint-500 flex items-center justify-center font-extrabold text-white">
              M
            </div>
            <span className="font-bold text-xl text-heading">MediBook</span>
          </div>

          <h2 className="text-[28px] font-extrabold text-heading mb-1">
            Welcome back
          </h2>
          <p className="text-gray-500 mb-8">
            Enter your credentials to access your account
          </p>

          {successMsg && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-mint-50 text-mint-700 text-sm font-medium">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {unverified && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium">
              Your email is not verified.{" "}
              <Link
                to="/verify-email"
                state={{ email: form.email }}
                className="underline font-semibold hover:text-amber-900"
              >
                Verify now
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="input-label mb-0!" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-500 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="Password"
                  type={showPw ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-brand-500 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>

          {/* DEV ONLY — remove before production */}
          {import.meta.env.DEV && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-center text-gray-400 font-medium">
                Dev Quick Login (UI only — no backend needed)
              </p>
              <div className="flex gap-2">
                {[
                  { role: "Patient", color: "brand" },
                  { role: "Doctor", color: "mint" },
                  { role: "Admin", color: "red" },
                ].map(({ role, color }) => {
                  // Lazy-import mock data to keep it tree-shaken in prod
                  const handleDevLogin = async () => {
                    const { DEV_USERS } = await import("../services/mockData");
                    const userData = DEV_USERS[role];
                    loginUser(userData, "dev-fake-token");
                    navigate(role === "Admin" ? "/admin" : "/");
                  };
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={handleDevLogin}
                      className={`flex-1 py-2 border-2 border-dashed rounded-xl text-xs font-semibold transition-colors border-gray-300 text-gray-500 hover:border-${color}-400 hover:text-${color}-500`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
