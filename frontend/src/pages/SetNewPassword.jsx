import { useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { setNewPassword } from "../services/authService";

export default function SetNewPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Support two flows:
  // - Admin enrollment: link contains ?email=...&token=... (token is Base64Url encoded)
  // - Forgot-password OTP flow: location.state contains { email, resetToken }
  const email = searchParams.get("email") || location.state?.email || "";
  const token = searchParams.get("token") || location.state?.resetToken || null;

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    if (!token) {
      setError("Invalid request: missing reset token. Please restart the password reset process.");
      return;
    }
    setLoading(true);
    try {
      // Both flows use the Identity reset token via set-new-password endpoint
      await setNewPassword({ email, token, newPassword: form.password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-mint-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-mint-500" />
          </div>
          <h2 className="text-[28px] font-extrabold text-heading mb-2">
            Password reset!
          </h2>
          <p className="text-gray-500 mb-8">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary px-8 py-3 text-[15px]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-500 to-mint-500 flex items-center justify-center font-extrabold text-white">
            M
          </div>
          <span className="font-bold text-xl text-heading">MediBook</span>
        </div>

        <h2 className="text-[28px] font-extrabold text-heading mb-1">
          Set new password
        </h2>
        <p className="text-gray-500 mb-8">
          Choose a strong password for your account.
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
                placeholder="Min. 6 characters"
                className="input-field pl-10 pr-10"
                required
                autoFocus
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="input-label">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showCf ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => { setForm({ ...form, confirm: e.target.value }); setError(""); }}
                placeholder="Repeat your password"
                className="input-field pl-10 pr-10"
                required
              />
              <button type="button" onClick={() => setShowCf(!showCf)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCf ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Match indicator */}
            {form.confirm && (
              <p className={`text-xs mt-1.5 font-medium ${form.password === form.confirm ? "text-mint-500" : "text-red-400"}`}>
                {form.password === form.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
