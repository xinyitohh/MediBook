import { useState, useEffect } from "react";
import { Calendar, Clock, FileText, Star, CheckCircle, CircleCheck, Eye, X } from "lucide-react";
import { getMyReports } from "../services";
import { mockReports, isDev, isDevToken } from "../dev/mockData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const badgeClasses = {
    Confirmed: "badge-confirmed",
    Pending: "badge-pending",
    Completed: "badge-completed",
    Cancelled: "badge-cancelled",
};

export default function AppointmentRow({ appointment, onCancel, onConfirm, onComplete, onReview, onViewReport }) {
    const { doctor, patient, specialty, date, time, status, notes, id, hasReview } = appointment;
    const navigate = useNavigate();
    const { user } = useAuth();
    const isDoctor = user?.role === "Doctor";
    const isPatient = user?.role === "Patient";
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        if (isDev && isDevToken()) {
            setReports(mockReports);
            setLoading(false);
            return;
        }
        getMyReports()
            .then((res) => setReports(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

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

            {/* Doctor actions */}
            {isDoctor && status === "Pending" && onConfirm && (
                <button
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
                    onClick={() => onConfirm(id)}
                >
                    <CheckCircle size={13} />
                    Confirm
                </button>
            )}

            {isDoctor && status === "Confirmed" && (
                <div className="flex items-center gap-2">
                    {onComplete && (
                        <button
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-mint-50 text-mint-600 hover:bg-mint-100 transition-colors border border-mint-200 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onComplete(id);
                            }}
                        >
                            <CircleCheck size={13} />
                            Complete
                        </button>
                    )}

                    {onViewReport && (
                        <button
                            className="btn-outline flex items-center gap-1.5 text-xs px-3 py-1.5"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking the row from doing anything else
                                onViewReport();
                            }}
                        >
                            <Eye size={13} /> 
                            View Report
                        </button>
                    )}
                </div>                
            )}

            {/* Write Report — doctor only, completed appointments */}
            {isDoctor && status === "Completed" && (
                <button
                    className="btn-outline flex items-center gap-1.5 text-xs px-3 py-1.5"
                    onClick={() =>
                        navigate(`/appointments/${id}/report`, {
                            state: { patient, doctor, date, time, specialty },
                        })
                    }
                >
                    <FileText size={14} />
                    Write Report
                </button>
            )}

            {/* Review button — patient only, completed, not yet reviewed */}
            {isPatient && status === "Completed" && onReview && (
                hasReview ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 px-3 py-1.5">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        Reviewed
                    </span>
                ) : (
                    <button
                        className="btn-outline flex items-center gap-1.5 text-xs px-3 py-1.5"
                        onClick={() => onReview(appointment)}
                    >
                        <Star size={13} />
                        Review
                    </button>
                )
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
