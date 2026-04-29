import { useState, useEffect } from "react";
import { Calendar, Clock, FileText, Star, CheckCircle, CircleCheck, Eye, X, ExternalLink, Paperclip } from "lucide-react";
import { getImageUrl } from "../services";
import { mockReports, isDev, isDevToken } from "../dev/mockData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const badgeClasses = {
    Confirmed: "bg-brand-50 text-brand-700 border-brand-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Completed: "bg-mint-50 text-mint-700 border-mint-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function AppointmentRow({ appointment, onCancel, onConfirm, onComplete, onReview, onViewReport, onViewDoctorReport }) {
    const { doctor, patient, specialty, date, time, status, notes, id, hasReview, hasDoctorReport, patientReportUrl, doctorProfileImageUrl, patientProfileImageUrl } = appointment;
    const navigate = useNavigate();
    const { user } = useAuth();
    const isDoctor = user?.role === "Doctor";
    const isPatient = user?.role === "Patient";

    // Generate initials from doctor or patient name
    const displayName = isDoctor ? patient : doctor;
    const targetImageUrl = isDoctor ? patientProfileImageUrl : doctorProfileImageUrl;

    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        if (targetImageUrl) {
            if (targetImageUrl.startsWith("http")) {
                setAvatarUrl(targetImageUrl);
            } else {
                getImageUrl(targetImageUrl)
                    .then((res) => setAvatarUrl(res.data.imageUrl))
                    .catch((err) => console.error("Could not load avatar", err));
            }
        }
    }, [targetImageUrl]);

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

    // Determine how many action buttons there are to decide layout
    const patientActionButtons = [];
    if (isPatient && status === "Completed" && onReview) patientActionButtons.push("review");
    if (isPatient && status === "Completed" && hasDoctorReport) patientActionButtons.push("viewDoctorReport");
    if (isPatient && canCancel && onCancel) patientActionButtons.push("cancel");
    if (isPatient && patientReportUrl) patientActionButtons.push("viewAttachment");

    // Single-button check for cancel — make it full width when it's the only button
    const isCancelAlone = isPatient && patientActionButtons.length === 1 && patientActionButtons[0] === "cancel";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col relative group">
            
            {/* Header: Status & Actions (Top Right) */}
            <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeClasses[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {status}
                </span>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-4 mb-5">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm"
                    />
                ) : (
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 ${avatarStyle}`}>
                        {initials}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 truncate">{displayName}</h4>
                    <p className="text-sm text-gray-500 font-medium truncate">{specialty || "General"}</p>
                </div>
            </div>

            {/* Middle Section: Details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-5 border border-gray-100/50">
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                    <Calendar size={16} className="text-gray-400" />
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                    <Clock size={16} className="text-gray-400" />
                    {time} {appointment.duration ? `(${appointment.duration} mins)` : ''}
                </div>
                {notes && (
                    <div className="flex items-start gap-3 text-sm text-gray-600 mt-2 pt-3 border-t border-gray-200/50">
                        <FileText size={16} className="text-gray-400 mt-0.5 shrink-0" />
                        <span className="italic">"{notes}"</span>
                    </div>
                )}

                {/* Patient Attachment: View in new tab */}
                {isPatient && patientReportUrl && (
                    <div className="flex items-center gap-3 text-sm mt-2 pt-3 border-t border-gray-200/50">
                        <Paperclip size={16} className="text-gray-400 shrink-0" />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onViewReport) onViewReport(); 
                            }}
                            className="text-brand-600 font-semibold hover:underline flex items-center gap-1.5"
                        >
                            View Attachment <Eye size={13} />
                        </button>
                    </div>
                )}

                {/* Doctor's Medical Report for Completed appointments */}
                {isPatient && status === "Completed" && hasDoctorReport && (
                    <div className="flex items-center gap-3 text-sm mt-2 pt-3 border-t border-gray-200/50">
                        <FileText size={16} className="text-brand-500 shrink-0" />
                        <button 
                            onClick={() => onViewDoctorReport && onViewDoctorReport(id)}
                            className="text-brand-600 font-semibold hover:underline flex items-center gap-1.5"
                        >
                            View Doctor's Report <Eye size={13} />
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {isDoctor && status === "Pending" && onConfirm && (
                    <button className="flex-1 min-w-[100px] flex justify-center items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors" onClick={() => onConfirm(id)}>
                        <CheckCircle size={15} /> Confirm
                    </button>
                )}

                {isDoctor && status === "Confirmed" && (
                    <div className="w-full flex gap-2">
                        {onComplete && (
                            <button className="flex-1 flex justify-center items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-mint-500 text-white hover:bg-mint-600 shadow-sm transition-colors" onClick={(e) => { e.stopPropagation(); onComplete(id); }}>
                                <CircleCheck size={15} /> Complete
                            </button>
                        )}
                        {onViewReport && (
                            <button className="flex-1 flex justify-center items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors" onClick={(e) => { e.stopPropagation(); onViewReport(); }}>
                                <Eye size={15} /> View Report
                            </button>
                        )}
                    </div>
                )}

                {/* Write Report */}
                {isDoctor && status === "Completed" && (
                    <button className="flex-1 flex justify-center items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors" onClick={() => navigate(`/appointments/${id}/report`, { state: { patient, doctor, date, time, specialty } })}>
                        <FileText size={15} /> Write Report
                    </button>
                )}

                {/* Review */}
                {isPatient && status === "Completed" && onReview && (
                    <button className="flex-1 flex justify-center items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" onClick={() => onReview(appointment)} disabled={hasReview}>
                        <Star size={15} className={hasReview ? "fill-amber-500" : ""} /> {hasReview ? "Reviewed" : "Review"}
                    </button>
                )}

                {/* Cancel — full width when it's the only action */}
                {canCancel && onCancel && (
                    <button className={`flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-xl text-red-500 hover:bg-red-50 bg-white border border-red-100 transition-colors hover:border-red-200 ${isCancelAlone ? 'flex-1 w-full' : ''}`} onClick={() => onCancel(id)}>
                        <X size={15} className="mr-1 inline" /> Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
