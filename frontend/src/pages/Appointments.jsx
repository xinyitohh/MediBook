import { useState, useEffect } from "react";
import { Plus, X, Search, Calendar as CalIcon, FileText, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments, cancelAppointment, confirmAppointment, completeAppointment, doctorCancelAppointment } from "../services";
import { mockAppointments, isDev, isDevToken } from "../dev/mockData";
import PageHeader from "../components/PageHeader";
import FilterTabs from "../components/FilterTabs";
import AppointmentRow from "../components/AppointmentRow";
import ReviewModal from "../components/ReviewModal";
import DoctorAppointments from "./DoctorAppointments";
import DatePicker from "../components/DatePicker";
import api from "../services/api";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    // Doctor Report Modal
    const [viewingDoctorReport, setViewingDoctorReport] = useState(null);
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        setLoading(true);
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

        const cancelReason = window.prompt("Please enter a reason for cancelling this appointment (minimum 5 characters):");

        if (!cancelReason || cancelReason.trim().length < 5) {
            alert("A valid reason (at least 5 characters) is required to cancel.");
            return;
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
                await cancelAppointment(id, cancelReason);
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

    const handleViewDoctorReport = async (appointmentId) => {
        setLoadingReport(true);
        try {
            const res = await api.get(`/api/medical-report/by-appointment/${appointmentId}`);
            setViewingDoctorReport(res.data);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to load report.");
        } finally {
            setLoadingReport(false);
        }
    };

    const filtered = appointments.filter((a) => {
        if (filter !== "All" && a.status !== filter) return false;
        if (searchQuery && !a.doctor?.toLowerCase().includes(searchQuery.toLowerCase()) && !a.specialty?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (selectedDate && a.date !== selectedDate) return false;
        return true;
    });

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

            {/* Search and Date Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by doctor or specialty..." 
                        className="input-field pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-[220px]">
                    <DatePicker
                        value={selectedDate}
                        onChange={(val) => setSelectedDate(val)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    No {filter === "All" ? "" : filter.toLowerCase() + " "}appointments found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((appt) => (
                        <AppointmentRow
                            key={appt.id}
                            appointment={appt}
                            onCancel={handleCancel}
                            onConfirm={handleConfirm}
                            onComplete={handleComplete}
                            onReview={setReviewTarget}
                            onViewDoctorReport={handleViewDoctorReport}
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

            {/* Patient Uploaded Report Viewer */}
            {viewingReportUrl && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
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

            {/* Doctor Generated Report Viewer Modal */}
            {viewingDoctorReport && (
                <div className="fixed inset-0 bg-black/60 z-[55] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Medical Report</h3>
                                <p className="text-sm text-gray-500">Generated by Doctor</p>
                            </div>
                            <button
                                onClick={() => setViewingDoctorReport(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Report Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">M</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">MediBook</h4>
                                    <p className="text-xs text-gray-500">Medical Report</p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-sm font-bold text-brand-600">Medical Report</p>
                                    <p className="text-xs text-gray-400">Generated: {viewingDoctorReport.uploadedAt ? new Date(viewingDoctorReport.uploadedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p>
                                </div>
                            </div>
                            <hr className="border-brand-200 mb-6" />

                            {viewingDoctorReport.diagnosis && (
                                <div className="mb-5">
                                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-2">Diagnosis</span>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <p className="text-sm text-gray-800">{viewingDoctorReport.diagnosis}</p>
                                    </div>
                                </div>
                            )}

                            {viewingDoctorReport.symptoms && (
                                <div className="mb-5">
                                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-2">Symptoms</span>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <p className="text-sm text-gray-800">{viewingDoctorReport.symptoms}</p>
                                    </div>
                                </div>
                            )}

                            {viewingDoctorReport.treatment && (
                                <div className="mb-5">
                                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-2">Treatment Plan</span>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <p className="text-sm text-gray-800">{viewingDoctorReport.treatment}</p>
                                    </div>
                                </div>
                            )}

                            {viewingDoctorReport.medications && (() => {
                                let meds = [];
                                try { meds = JSON.parse(viewingDoctorReport.medications); } catch(e) {}
                                if (!Array.isArray(meds) || meds.length === 0) return null;
                                return (
                                    <div className="mb-5">
                                        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-2">Prescribed Medications</span>
                                        <div className="overflow-hidden rounded-xl border border-gray-100">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-brand-500 text-white">
                                                        <th className="text-left px-4 py-2 font-semibold">Medicine</th>
                                                        <th className="text-left px-4 py-2 font-semibold">Dosage</th>
                                                        <th className="text-left px-4 py-2 font-semibold">Frequency</th>
                                                        <th className="text-left px-4 py-2 font-semibold">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {meds.map((med, idx) => (
                                                        <tr key={idx} className="border-t border-gray-100">
                                                            <td className="px-4 py-2.5 text-gray-800">{med.name || med.Name || '—'}</td>
                                                            <td className="px-4 py-2.5 text-gray-600">{med.dosage || med.Dosage || '—'}</td>
                                                            <td className="px-4 py-2.5 text-gray-600">{med.frequency || med.Frequency || '—'}</td>
                                                            <td className="px-4 py-2.5 text-gray-600">{med.duration || med.Duration || '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })()}

                            {viewingDoctorReport.notes && (
                                <div className="mb-5">
                                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-2">Doctor Notes</span>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <p className="text-sm text-gray-800">{viewingDoctorReport.notes}</p>
                                    </div>
                                </div>
                            )}

                            {viewingDoctorReport.followUpDate && (
                                <div className="mb-5">
                                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-2">Follow-Up Date</span>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <p className="text-sm text-gray-800">{viewingDoctorReport.followUpDate}</p>
                                    </div>
                                </div>
                            )}

                            <p className="text-center text-xs text-gray-400 mt-6">This document is confidential and intended for the patient only</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
