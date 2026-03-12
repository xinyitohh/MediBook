import { useState } from "react";
import { Star, X, Send } from "lucide-react";
import { submitReview } from "../services";

export default function ReviewModal({ appointment, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a rating."); return; }
    setSubmitting(true);
    setError("");
    try {
      await submitReview({
        appointmentId: appointment.id,
        rating,
        comment,
      });
      onSubmitted(appointment.id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const activeRating = hovered || rating;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-heading">Rate Your Visit</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Doctor info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-mint-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {(appointment.doctor || "")
                .replace("Dr. ", "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-heading truncate">
                {appointment.doctor}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {appointment.specialty} · {appointment.date}
              </p>
            </div>
          </div>

          {/* Star rating */}
          <div className="text-center mb-5">
            <p className="text-sm font-semibold text-gray-600 mb-3">
              How was your experience?
            </p>
            <div
              className="flex justify-center gap-2 mb-2"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onClick={() => { setRating(star); setError(""); }}
                  className="transition-transform duration-100 hover:scale-110 active:scale-95"
                >
                  <Star
                    size={36}
                    className={`transition-colors duration-100 ${
                      star <= activeRating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {activeRating > 0 && (
              <p className="text-sm font-semibold text-amber-500">
                {labels[activeRating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="input-label">
              Comment <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this doctor..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500 font-medium">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline flex-1 py-2.5">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={15} />
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
