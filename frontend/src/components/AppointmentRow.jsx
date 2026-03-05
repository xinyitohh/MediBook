import { Calendar, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const badgeClasses = {
  Confirmed: "badge-confirmed",
  Pending:   "badge-pending",
  Completed: "badge-completed",
  Cancelled: "badge-cancelled",
};

export default function AppointmentRow({ appointment, onCancel }) {
  const { doctor, patient, specialty, date, time, status, notes, id } = appointment;
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDoctor = user?.role === "Doctor";

  // Generate initials from doctor or patient name
  const displayName = isDoctor ? patient : doctor;
  const initials = (displayName || "")
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const avatarColors = [
    "bg-brand-50 text-brand-600",
    "bg-purple-50 text-purple-600",
    "bg-mint-50 text-mint-600",
    "bg-orange-50 text-orange-600",
  ];
  const avatarStyle = avatarColors[(id || 0) % avatarColors.length];

  const canCancel = status === "Pending" || status === "Confirmed";

  return (
    <div className="card flex items-center gap-4 p-5">
      {/* Avatar */}
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base shrink-0 ${avatarStyle}`}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-bold text-heading">{displayName || doctor}</h4>
        <p className="text-sm text-gray-500 truncate">
          {specialty}{notes && ` · ${notes}`}
        </p>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-sm text-gray-600">
        <Calendar size={14} />
        <span>{date}</span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1.5 text-sm text-gray-600">
        <Clock size={14} />
        <span>{time}</span>
      </div>

      {/* Status badge */}
      <span className={badgeClasses[status] || "badge bg-gray-100 text-gray-500"}>
        {status}
      </span>

      {/* Write Report — doctor only, completed appointments */}
      {isDoctor && status === "Completed" && (
        <button
          className="btn-outline flex items-center gap-1.5 text-xs px-3 py-1.5"
          onClick={() =>
            navigate(`/appointments/${id}/report`, {
              state: { patient: patient || doctor, date, time, specialty },
            })
          }
        >
          <FileText size={14} />
          Write Report
        </button>
      )}

      {/* Cancel button */}
      {canCancel && onCancel && (
        <button className="btn-danger-outline" onClick={() => onCancel(id)}>
          Cancel
        </button>
      )}
    </div>
  );
}
