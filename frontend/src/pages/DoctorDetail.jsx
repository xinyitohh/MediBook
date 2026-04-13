import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, CheckCircle, MessageSquare, UploadCloud, File, X } from "lucide-react";
import { getDoctorById, getAvailableSlots, getDoctorReviews, getImageUrl } from "../services";
import { getPublicDoctorSchedule } from "../services/doctorService";
import { bookAppointment } from "../services/appointmentService";
import api from "../services/api";
import DatePicker from "../components/DatePicker";

export default function DoctorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [reviews, setReviews] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState(null);

    // Drag and Drop State
    const [reportFile, setReportFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingReport, setUploadingReport] = useState(false);

    useEffect(() => {
        getDoctorById(id)
            .then((res) => setDoctor(res.data))
            .catch(() => navigate("/doctors"))
            .finally(() => setLoading(false));
        getDoctorReviews(id)
            .then((res) => setReviews(res.data ?? []))
            .catch(() => { });
        getPublicDoctorSchedule(id)
            .then((res) => setSchedule(res.data || []))
            .catch(() => { });
    }, [id]);

    useEffect(() => {
        if (!selectedDate || !id) return;
        getAvailableSlots(id, selectedDate)
            .then((res) => setSlots(res.data))
            .catch(() => setSlots([]));
    }, [selectedDate, id]);

    useEffect(() => {
        if (doctor?.profileImageUrl) {
            if (doctor.profileImageUrl.startsWith("http")) {
                setAvatarUrl(doctor.profileImageUrl);
            } else {
                getImageUrl(doctor.profileImageUrl)
                    .then((res) => setAvatarUrl(res.data.imageUrl))
                    .catch((err) => console.error("Could not load doctor image", err));
            }
        }
    }, [doctor?.profileImageUrl]);

    const handleBook = async () => {
        if (!selectedDate || !selectedSlot) return;
        setBooking(true);
        setError("");
        
        try {
            let reportId = null;
            // Optional file upload
            if (reportFile) {
                setUploadingReport(true);
                const formData = new FormData();
                formData.append("file", reportFile);
                formData.append("description", "Uploaded during appointment booking");
                
                try {
                    const uploadRes = await api.post("/api/upload/medical-report", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    reportId = uploadRes.data.id;
                } catch (uploadErr) {
                    setError(uploadErr.response?.data?.message || "Medical report upload failed.");
                    setUploadingReport(false);
                    setBooking(false);
                    return; // Stop booking if upload strictly fails
                }
                setUploadingReport(false);
            }

            await bookAppointment({
                doctorId: parseInt(id),
                appointmentDate: selectedDate,
                timeSlot: selectedSlot,
                notes,
                medicalReportId: reportId
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed.");
        } finally {
            setBooking(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setReportFile(e.dataTransfer.files[0]);
        }
    };

    const isAvailableDay = (date) => {
        // 1. Check if date is among doctor's specific leave dates
        if (doctor?.leaveDates && doctor.leaveDates.length > 0) {
            const isLeaveDay = doctor.leaveDates.some(ld => {
                const leaveDate = new Date(ld);
                return leaveDate.getFullYear() === date.getFullYear() &&
                       leaveDate.getMonth() === date.getMonth() &&
                       leaveDate.getDate() === date.getDate();
            });
            if (isLeaveDay) return false;
        }

        // 2. Check regular weekly schedule
        if (!schedule || schedule.length === 0) return true; // allow all if no schedule is set yet
        const dayOfWeek = date.getDay(); // 0 is Sunday
        const config = schedule.find(s => s.dayOfWeek === dayOfWeek);
        return config ? config.isActive : false;
    };

    // 🔹 Format time (SAFE VERSION)
    const formatTime = (time24) => {
        if (!time24) return "";

        const parts = time24.split(":");
        const hour = parseInt(parts[0], 10);
        const minute = parseInt(parts[1], 10);

        return new Date(0, 0, 0, hour, minute).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Get tomorrow as min date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Loading...</div>;
    }

    if (!doctor) return null;

    const initials = doctor.fullName
        .replace("Dr. ", "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);

    if (success) {
        return (
            <div className="max-w-lg mx-auto mt-20 text-center">
                <div className="w-20 h-20 rounded-full bg-mint-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-mint-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-heading mb-2">
                    Appointment Booked!
                </h2>
                <p className="text-gray-500 mb-6">
                    Your appointment with {doctor.fullName} on {selectedDate} at{" "}
                    {selectedSlot} has been submitted.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate("/appointments")}
                        className="btn-primary"
                    >
                        View My Appointments
                    </button>
                    <button onClick={() => navigate("/doctors")} className="btn-outline">
                        Browse Doctors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Back button */}
            <button
                onClick={() => navigate("/doctors")}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft size={16} />
                Back to Doctors
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left — Doctor profile */}
                <div className="lg:col-span-1">
                    <div className="card-padded text-center">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl} 
                                alt={doctor.fullName}
                                className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-sm"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-4">
                                {initials}
                            </div>
                        )}

                        <h2 className="text-xl font-extrabold text-heading">
                            {doctor.fullName}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">{doctor.specialty}</p>

                        <div className="flex items-center justify-center gap-1 mb-4">
                            <Star size={16} className="text-amber-400 fill-amber-400" />
                            <span className="font-bold text-heading">
                                {doctor.rating || "4.8"}
                            </span>
                            <span className="text-sm text-gray-400">
                                ({doctor.reviewCount || 0} reviews)
                            </span>
                        </div>

                        {doctor.consultationFee && (
                            <p className="text-lg font-bold text-brand-500 mb-4">
                                RM {doctor.consultationFee}
                            </p>
                        )}

                        <p className="text-sm text-gray-500 leading-relaxed">
                            {doctor.description ||
                                "Experienced specialist dedicated to providing quality healthcare."}
                        </p>
                    </div>
                </div>

                {/* Right — Booking form */}
                <div className="lg:col-span-2">
                    <div className="card-padded">
                        <h3 className="text-lg font-bold text-heading mb-5">
                            Book an Appointment
                        </h3>

                        {error && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Date picker */}
                        <div className="mb-5">
                            <label className="input-label">Select Date</label>
                            <DatePicker
                                minDate={new Date()}
                                value={selectedDate}
                                onChange={(val) => {
                                    setSelectedDate(val);
                                    setSelectedSlot("");
                                }}
                                filterDate={isAvailableDay}
                            />
                        </div>

                        {/* Time slots */}
                        {selectedDate && (
                            <div className="mb-5">
                                <label className="input-label">Available Time Slots</label>
                                {slots.length === 0 ? (
                                    <p className="text-sm text-gray-400 py-4">
                                        No available slots for this date.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {slots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${selectedSlot === slot
                                                        ? "bg-brand-500 text-white shadow-[0_4px_12px_rgba(15,111,255,0.25)]"
                                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {formatTime(slot)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Medical Report Upload */}
                        <div className="mb-5">
                            <label className="input-label">Upload Medical Report (Optional)</label>
                            
                            {!reportFile ? (
                                <div 
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${isDragging ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"}`}
                                >
                                    <UploadCloud size={32} className={`mx-auto mb-3 ${isDragging ? "text-brand-500" : "text-gray-400"}`} />
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Drag and drop your report here</p>
                                    <p className="text-xs text-gray-500 mb-4">Support PDF, JPG, PNG (Max 10MB)</p>
                                    
                                    <label className="btn-outline cursor-pointer bg-white mx-auto inline-flex text-xs py-2 px-4">
                                        Browse Files
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setReportFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 rounded-xl border border-brand-100 bg-brand-50/50">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                                            <File size={20} className="text-brand-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{reportFile.name}</p>
                                            <p className="text-xs text-gray-500">{(reportFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setReportFile(null)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="mb-6">
                            <label className="input-label">Purpose of Visit (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Describe your symptoms or reason for visit..."
                                rows={3}
                                className="input-field resize-none"
                            />
                        </div>

                        {/* Confirm button */}
                        <button
                            onClick={handleBook}
                            disabled={!selectedDate || !selectedSlot || booking || uploadingReport}
                            className="btn-primary w-full py-3 text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {uploadingReport ? "Uploading Report..." : booking ? "Booking..." : "Confirm Appointment"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Reviews section ── */}
            <div className="mt-6">
                <h3 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
                    <MessageSquare size={18} className="text-brand-500" />
                    Patient Reviews
                    {reviews.length > 0 && (
                        <span className="text-sm font-normal text-gray-400">
                            ({reviews.length})
                        </span>
                    )}
                </h3>

                {reviews.length === 0 ? (
                    <div className="card p-8 text-center text-gray-400">
                        <Star size={28} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No reviews yet for this doctor.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReviewCard({ review }) {
    return (
        <div className="card-padded">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {(review.patientName || "P")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-heading">
                            {review.patientName || "Patient"}
                        </p>
                        <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={12}
                                    className={
                                        s <= review.rating
                                            ? "text-amber-400 fill-amber-400"
                                            : "text-gray-200 fill-gray-200"
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                    {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })
                        : ""}
                </span>
            </div>
            {review.comment && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                </p>
            )}
        </div>
    );
}
