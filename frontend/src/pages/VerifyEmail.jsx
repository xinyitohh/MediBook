import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, RotateCcw } from "lucide-react";
import { verifyEmail, resendOtp } from "../services";

export default function VerifyEmail() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const email     = state?.email || "";

  const [digits, setDigits]       = useState(Array(6).fill(""));
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  /* ── Countdown timer ── */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* ── Auto-focus first input ── */
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  function handleDigitChange(idx, val) {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    setError("");
    if (char && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    } else if (char && idx === 5) {
      const code = next.join("");
      if (code.length === 6) autoSubmit(code);
    }
  }

  async function autoSubmit(code) {
    setLoading(true);
    setError("");
    try {
      await verifyEmail({ email, code });
      navigate("/login", { state: { verified: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(idx, e) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    await autoSubmit(code);
  }

  async function handleResend() {
    setResending(true);
    setResendMsg("");
    setError("");
    try {
      await resendOtp({ email });
      setResendMsg("A new code has been sent to your email.");
      setCountdown(60);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
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

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-5">
          <ShieldCheck size={28} className="text-brand-500" />
        </div>

        <h2 className="text-[28px] font-extrabold text-heading mb-1">
          Verify your email
        </h2>
        <p className="text-gray-500 mb-1">
          We sent a 6-digit code to
        </p>
        <p className="font-semibold text-heading mb-7">{email || "your email"}</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}
        {resendMsg && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-mint-50 text-mint-600 text-sm font-medium">
            {resendMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* OTP inputs */}
          <div className="flex justify-center gap-3 mb-7" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-150 caret-transparent
                  ${d
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-gray-200 bg-white text-heading hover:border-brand-300 hover:bg-brand-50/40"}
                  focus:border-brand-400 focus:bg-brand-50 focus:ring-3 focus:ring-brand-100`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying…" : "Verify Email"}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Didn't receive a code?
        </div>
        <div className="mt-2 text-center">
          {countdown > 0 ? (
            <span className="text-sm text-gray-400 font-medium">Resend in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-brand-500 font-semibold hover:underline inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw size={13} />
              {resending ? "Sending…" : "Resend code"}
            </button>
          )}
        </div>

        <p className="text-center mt-4 text-sm text-gray-400">
          Wrong email?{" "}
          <button onClick={() => navigate("/register")} className="text-brand-500 font-semibold hover:underline">
            Go back
          </button>
        </p>
      </div>
    </div>
  );
}
