import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotPassword } from "../services";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword({ email });
      navigate("/reset-code", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
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

        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to login
        </button>

        <h2 className="text-[28px] font-extrabold text-heading mb-1">
          Forgot password?
        </h2>
        <p className="text-gray-500 mb-8">
          Enter your email and we'll send you a reset code.
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Email address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="john@example.com"
                className="input-field pl-10"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
