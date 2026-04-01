import { useState, useEffect } from "react";
import { Plus, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments, cancelAppointment, confirmAppointment, completeAppointment, doctorCancelAppointment } from "../services";
import { mockAppointments, isDev, isDevToken } from "../dev/mockData";
import PageHeader from "../components/PageHeader";
import FilterTabs from "../components/FilterTabs";
import AppointmentRow from "../components/AppointmentRow";
import ReviewModal from "../components/ReviewModal";
import DoctorAppointments from "./DoctorAppointments";

const FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function Appointments() {
    const { user } = useAuth();

    if (user?.role === "Doctor") {
        return <DoctorAppointments />;
    }
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [reviewTarget, setReviewTarget] = useState(null);
    const navigate = useNavigate();
    const [viewingReportUrl, setViewingReportUrl] = useState(null);
    const [viewingReportName, setViewingReportName] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        setLoading(true);
        // Only use mock data if specifically requested or in non-browser env, 
        // but always prioritize real API if we have a token.
        getMyAppointments()
            .then((res) => setAppointments(res.data))
            .catch(() => {
                if (isDev && isDevToken()) {
                    const role = user?.role || "Patient";
                    setAppointments(mockAppointments[role] || []);
                }
            })
            .finally(() => setLoading(false));
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        let cancelReason = "";
        if (user?.role === "Doctor") {
            cancelReason = window.prompt("Please enter a reason for cancelling this appointment (minimum 5 characters):");

            if (!cancelReason || cancelReason.trim().length < 5) {
                alert("A valid reason (at least 5 characters) is required to cancel.");
                return;
            }
        }

        if (isDev && isDevToken()) {
            setAppointments((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
            );
            return;
        }

        try {
            if (user?.role === "Doctor") {
                await doctorCancelAppointment(id, cancelReason);
            } else {
                await cancelAppointment(id);
            }

            setAppointments((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
            );
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel.");
        }
    };

    const handleConfirm = async (id) => {
        try {
            await confirmAppointment(id);
            setAppointments((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status: "Confirmed" } : a))
            );
        } catch (err) {
            alert(err.response?.data?.message || "Failed to confirm.");
        }
    };

    const handleComplete = async (id, notes) => {
        try {
            await completeAppointment(id, { doctorNotes: notes });
            setAppointments((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status: "Completed" } : a))
            );
        } catch (err) {
            alert(err.response?.data?.message || "Failed to complete.");
        }
    };

    const handleReviewSubmitted = (appointmentId) => {
        setAppointments((prev) =>
            prev.map((a) => (a.id === appointmentId ? { ...a, hasReview: true } : a))
        );
        setReviewTarget(null);
    };

    const filtered =
        filter === "All"
            ? appointments
            : appointments.filter((a) => a.status === filter);

    return (
        <div>
            <PageHeader
                title={user?.role === "Doctor" ? "My Schedule" : "My Appointments"}
                subtitle={user?.role === "Doctor" ? "Manage and track your daily schedule" : "Manage and track your appointments"}
            >
                {user?.role === "Patient" && (
                    <button
                        onClick={() => navigate("/doctors")}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Book New
                    </button>
                )}
            </PageHeader>

            <FilterTabs tabs={FILTERS} active={filter} onChange={setFilter} />

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    No {filter === "All" ? "" : filter.toLowerCase() + " "}appointments found.
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((appt) => (
                        <AppointmentRow
                            key={appt.id}
                            appointment={appt}
                            onCancel={handleCancel}
                            onConfirm={handleConfirm}
                            onComplete={handleComplete}
                            onReview={setReviewTarget}
                            onViewReport={() => {
                                if (appt.patientReportUrl) {
                                    setViewingReportUrl(appt.patientReportUrl);
                                    setViewingReportName("Patient's Report"); 
                                } else {
                                    alert("No report has been uploaded for this appointment yet.");
                                }
                            }}
                        />
                    ))}
                </div>
            )}

            {reviewTarget && (
                <ReviewModal
                    appointment={reviewTarget}
                    onClose={() => setReviewTarget(null)}
                    onSubmitted={handleReviewSubmitted}
                />
            )}

            {viewingReportUrl && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{viewingReportName}</h3>
                                <p className="text-xs text-gray-500">Uploaded by Patient</p>
                            </div>
                            <button
                                onClick={() => {
                                    setViewingReportUrl(null);
                                    setViewingReportName("");
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 bg-gray-100 p-4 relative">
                            {viewingReportUrl.includes(".pdf") ? (
                                <iframe
                                    src={`http://localhost:5082${viewingReportUrl}`}
                                    className="w-full h-full rounded-lg border-0 bg-white shadow-sm"
                                    title="PDF Viewer"
                                />
                            ) : (
                                <img
                                    src={`http://localhost:5082${viewingReportUrl}`}
                                    alt="Medical Report"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
