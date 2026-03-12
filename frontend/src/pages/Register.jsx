import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { registerPatient } from "../services";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Patient",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerPatient(form);
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-mint-50 mx-auto mb-4">
              <CheckCircle size={32} className="text-mint-500" />
            </div>
            <h3 className="text-xl font-extrabold text-heading mb-2">
              Account Created!
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Your account has been successfully created. You can now sign in.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn-primary w-full py-3 text-[15px]"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-mint-500 flex items-center justify-center font-extrabold text-white">
            M
          </div>
          <span className="font-bold text-xl text-heading">MediBook</span>
        </div>

        <h2 className="text-[28px] font-extrabold text-heading mb-1">
          Create an account
        </h2>
        <p className="text-gray-500 mb-8">
          Join MediBook to start booking appointments
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Full Name</label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="John Doe"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Email</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="input-field pl-10 pr-10"
                required
                minLength={1} // TEMP: easier testing
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-500 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
