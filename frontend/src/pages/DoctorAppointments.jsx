import { useState, useEffect } from "react";
import { Plus, X, Check, FileText, Ban, Calendar as CalIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    getMyAppointments,
    confirmAppointment,
    completeAppointment,
    doctorCancelAppointment,
    rescheduleAppointment,
    bookAppointment,
    getSecurePatientReportUrl
} from "../services";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import DatePicker from "../components/DatePicker";
import CancelConfirmationModal from "../components/CancelConfirmationModal";

// React Big Calendar
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const locales = {
    'en-US': enUS,
}
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reschedulingId, setReschedulingId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewingReportUrl, setViewingReportUrl] = useState(null);
    const [viewingDoctorReport, setViewingDoctorReport] = useState(null);
    const [loadingReport, setLoadingReport] = useState(false);

    // Lightbox State
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [lbForm, setLbForm] = useState({ patientId: "", date: "", time: "", notes: "" });
    const [lbSubmitting, setLbSubmitting] = useState(false);

    // Cancel State
    const [cancellingId, setCancellingId] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    // Navigation State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("week");

    const navigate = useNavigate();
    const { user } = useAuth(); // Assume Doctor role

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        if (isLightboxOpen && patients.length === 0) {
            // Load patients if not already loaded when lightbox is opened
            api.get('/api/patient/all')
                .then(res => setPatients(res.data))
                .catch(err => console.error("Could not fetch patients.", err));
        }
    }, [isLightboxOpen]);

    const fetchAppointments = () => {
        setLoading(true);
        getMyAppointments()
            .then((res) => {
                const formattedEvents = res.data.map(appt => {
                    // Ensure robust date parsing: appt.date is YYYY-MM-DD, appt.time is HH:mm
                    // If appt.time contains " AM" or " PM", we need to strip it or parse accordingly
                    let timeStr = appt.time;
                    if (timeStr.includes(' ')) {
                        timeStr = timeStr.split(' ')[0]; // Take only the HH:mm part
                    }
                    
                    const start = new Date(`${appt.date}T${timeStr}:00`);
                    if (isNaN(start.getTime())) {
                        console.error("Invalid date for appointment:", appt);
                    }
                    
                    const durationMins = appt.duration || 30;
                    const end = new Date(start.getTime() + durationMins * 60000); 
                    return {
                        id: appt.id,
                        title: `${appt.patient} - ${appt.notes || 'No purpose stated'}`,
                        start,
                        end,
                        resource: appt
                    };
                });
                setAppointments(formattedEvents);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    const handleConfirm = async (id) => {
        try {
            await confirmAppointment(id);
            updateLocalEventStatus(id, "Confirmed");
            setSelectedEvent(null);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to confirm.");
        }
    };

    const handleComplete = async (id) => {
        try {
            await completeAppointment(id, { doctorNotes: "Completed via Dashboard" });
            updateLocalEventStatus(id, "Completed");
            setSelectedEvent(null);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to complete.");
        }
    };

    const handleCancel = async (id, cancelReason) => {
        setIsCancelling(true);
        try {
            await doctorCancelAppointment(id, cancelReason);
            updateLocalEventStatus(id, "Cancelled");
            setSelectedEvent(null);
            setCancellingId(null);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel.");
        } finally {
            setIsCancelling(false);
        }
    };

    const updateLocalEventStatus = (id, newStatus) => {
        setAppointments(prev => prev.map(ev => {
            if (ev.id === id) {
                return {
                    ...ev,
                    title: `${ev.resource.patient} - ${newStatus}`,
                    resource: { ...ev.resource, status: newStatus }
                };
            }
            return ev;
        }));
    };

    // DRAG AND DROP HANDLER
    const onEventDrop = async ({ event, start, end }) => {
        if (event.resource.status === 'Cancelled' || event.resource.status === 'Completed') {
            alert("Cannot reschedule completed or cancelled appointments.");
            return;
        }

        const newDateStr = format(start, 'yyyy-MM-dd');
        const newTimeStr = format(start, 'HH:mm');

        // Optimistically update
        const originalAppointments = [...appointments];
        setAppointments(prev => prev.map(ev => 
            ev.id === event.id ? { ...ev, start, end } : ev
        ));
        setReschedulingId(event.id);

        try {
            await rescheduleAppointment(event.id, {
                appointmentDate: newDateStr,
                timeSlot: newTimeStr
            });
            // Also update the resource backing object so modal shows new time
            setAppointments(prev => prev.map(ev => 
                ev.id === event.id ? { 
                    ...ev, 
                    resource: { ...ev.resource, date: newDateStr, time: newTimeStr } 
                } : ev
            ));
        } catch (err) {
            // Revert on fail
            setAppointments(originalAppointments);
            alert(err.response?.data?.message || "Time slot unavailable. Failed to reschedule.");
        } finally {
            setReschedulingId(null);
        }
    };

    const handleCreateAppointment = async (e) => {
        e.preventDefault();
        setLbSubmitting(true);
        try {
            await bookAppointment({
                doctorId: user.profileId, // Doctor is booking for themselves
                patientId: Number(lbForm.patientId),
                appointmentDate: lbForm.date,
                timeSlot: lbForm.time,
                notes: lbForm.notes
            });
            alert("Appointment created successfully!");
            setIsLightboxOpen(false);
            setLbForm({ patientId: "", date: "", time: "", notes: "" });
            fetchAppointments(); // Refresh calendar completely
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create appointment.");
        } finally {
            setLbSubmitting(false);
        }
    };

    // DHTMLX-LIKE STYLE
    const eventStyleGetter = (event) => {
        // Soft backgrounds and darker borders for "DHTMLX style" premium look
        let backgroundColor = '#EBF5FF'; // default pending blue tint
        let borderColor = '#93C5FD';
        let color = '#1E3A8A'; // dark blue text
        let isFaded = reschedulingId === event.id;

        if (event.resource.status === 'Pending') {
            backgroundColor = '#FEF9C3';
            borderColor = '#FDE047';
            color = '#854D0E';
        } else if (event.resource.status === 'Confirmed') {
            // "Fresha" / DHTMLX blue aesthetic
            backgroundColor = '#EFF6FF';
            borderColor = '#60A5FA';
            color = '#1D4ED8';
        } else if (event.resource.status === 'Completed') {
            backgroundColor = '#DCFCE7';
            borderColor = '#86EFAC';
            color = '#166534';
        } else if (event.resource.status === 'Cancelled') {
            backgroundColor = '#FEE2E2';
            borderColor = '#FCA5A5';
            color = '#991B1B';
        }

        return {
            style: {
                backgroundColor,
                borderLeft: `4px solid ${borderColor}`, // Thick left border
                borderTop: '0',
                borderRight: '0',
                borderBottom: '0',
                color,
                borderRadius: '4px',
                display: 'block',
                fontWeight: '600',
                fontSize: '12px',
                padding: '2px 6px',
                opacity: isFaded ? 0.5 : 1,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            },
            className: "text-sm",
        };
    };

    const handleNavigate = (newDate) => {
        setSelectedDate(newDate);
    };

    const handleViewChange = (newView) => {
        setCurrentView(newView);
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
                <PageHeader
                    title="My Schedule"
                    subtitle="Drag and drop upcoming appointments to reschedule"
                />
                <button 
                    onClick={() => setIsLightboxOpen(true)}
                    className="btn-primary flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} /> New Appointment
                </button>
            </div>

            {/* Calendar Area */}
            <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col calendar-override">
                <DnDCalendar
                    localizer={localizer}
                    events={appointments}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    view={currentView}
                    onView={handleViewChange}
                    date={selectedDate}
                    onNavigate={handleNavigate}
                    step={30}
                    showMultiDayTimes
                    onSelectEvent={(e) => setSelectedEvent(e.resource)}
                    onEventDrop={onEventDrop}
                    resizable={false} // Only allow dropping full blocks
                    eventPropGetter={eventStyleGetter}
                    style={{ height: "calc(100vh - 280px)" }}
                    className="font-sans text-gray-700"
                />
            </div>

            {/* ── DRAG AND DROP BACKDROP ── */}
            {reschedulingId && (
                <div className="fixed inset-0 bg-white/20 z-[40] flex items-center justify-center backdrop-blur-sm pointer-events-none">
                    <div className="bg-white px-5 py-3 rounded-xl shadow-lg border border-brand-100 flex items-center gap-3 text-brand-700 font-semibold animate-pulse">
                        <CalIcon size={20} className="animate-spin" /> Rescheduling...
                    </div>
                </div>
            )}

            {/* ── Lightbox for New Appointment ── */}
            {isLightboxOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-900">Create Appointment</h3>
                            <button onClick={() => setIsLightboxOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 overflow-hidden flex items-center justify-center">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
                            <div>
                                <label className="input-label">Patient</label>
                                <select 
                                    required 
                                    className="input-field"
                                    value={lbForm.patientId}
                                    onChange={(e) => setLbForm({...lbForm, patientId: e.target.value})}
                                >
                                    <option value="">Select a patient...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.fullName} ({p.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Date</label>
                                    <DatePicker
                                        value={lbForm.date}
                                        onChange={(val) => setLbForm({...lbForm, date: val})}
                                        minDate={new Date()}
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Time</label>
                                    <input 
                                        type="time" 
                                        required 
                                        step="1800" // 30 min intervals
                                        className="input-field" 
                                        value={lbForm.time}
                                        onChange={(e) => setLbForm({...lbForm, time: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Purpose of Visit (Optional)</label>
                                <textarea 
                                    className="input-field min-h-[80px]" 
                                    placeholder="Add any internal notes..."
                                    value={lbForm.notes}
                                    onChange={(e) => setLbForm({...lbForm, notes: e.target.value})}
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsLightboxOpen(false)} className="btn-outline flex-1">
                                    Cancel
                                </button>
                                <button type="submit" disabled={lbSubmitting} className="btn-primary flex-1 disabled:opacity-50">
                                    {lbSubmitting ? "Creating..." : "Create Appointment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Action Modal ── */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 z-[45] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
                        
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Appointment Details</h3>
                                <p className="text-sm font-medium text-gray-500">
                                    ID: #{selectedEvent.id}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg shrink-0">
                                    {selectedEvent.patient?.[0]?.toUpperCase() || "P"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{selectedEvent.patient}</h4>
                                    <p className="text-sm text-gray-500">
                                        {selectedEvent.date} • {format(new Date(`${selectedEvent.date}T${selectedEvent.time}:00`), "hh:mm a")} - {format(new Date(new Date(`${selectedEvent.date}T${selectedEvent.time}:00`).getTime() + (selectedEvent.duration || 30) * 60000), "hh:mm a")}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                                        selectedEvent.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                        selectedEvent.status === 'Confirmed' ? 'bg-brand-100 text-brand-700' :
                                        selectedEvent.status === 'Completed' ? 'bg-mint-100 text-mint-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {selectedEvent.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Created Date & Time</span>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {selectedEvent.createdAt ? new Date(selectedEvent.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {selectedEvent.status === 'Cancelled' && selectedEvent.cancellationReason && (
                                <div>
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">Cancellation Reason</span>
                                    <p className="text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-100">
                                        "{selectedEvent.cancellationReason}"
                                    </p>
                                </div>
                            )}

                            {selectedEvent.notes && (
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Purpose of Visit</span>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        "{selectedEvent.notes}"
                                    </p>
                                </div>
                            )}

                            {selectedEvent.patientReportUrl && (
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Medical Report</span>
                                    <button
                                        onClick={async () => {
                                            try {
                                                // Fetch the 5-minute VIP pass from AWS S3
                                                const res = await getSecurePatientReportUrl(selectedEvent.id);
                                                setViewingReportUrl(res.data.secureUrl);
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}
                                        className="text-sm text-brand-600 font-semibold flex items-center gap-2 hover:underline"
                                    >
                                        <FileText size={16} />
                                        View Uploaded Report
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 flex-wrap">
                            {selectedEvent.status === "Pending" && (
                                <>
                                    <button onClick={() => handleConfirm(selectedEvent.id)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                        <Check size={16} /> Confirm
                                    </button>
                                    <button onClick={() => setCancellingId(selectedEvent.id)} className="btn-outline flex-1 flex items-center justify-center gap-2 !border-red-200 !text-red-500 hover:!bg-red-50">
                                        <Ban size={16} /> Cancel
                                    </button>
                                </>
                            )}

                            {selectedEvent.status === "Confirmed" && (
                                <button onClick={() => handleComplete(selectedEvent.id)} className="btn-primary flex-1 bg-mint-500 hover:bg-mint-600 shadow-mint-500/20">
                                    <Check size={16} className="mr-2 inline" /> Mark Completed
                                </button>
                            )}

                            {selectedEvent.status === "Completed" && (
                                selectedEvent.hasDoctorReport ? (
                                    <button 
                                        disabled={loadingReport}
                                        onClick={async () => {
                                            setLoadingReport(true);
                                            try {
                                                const res = await api.get(`/api/medical-report/by-appointment/${selectedEvent.id}`);
                                                setViewingDoctorReport(res.data);
                                            } catch (err) {
                                                alert(err.response?.data?.message || "Failed to load report.");
                                            } finally {
                                                setLoadingReport(false);
                                            }
                                        }} 
                                        className="btn-primary flex-1 bg-brand-500 hover:bg-brand-600 shadow-brand-500/20 disabled:opacity-60"
                                    >
                                        <FileText size={16} className="mr-2 inline" /> {loadingReport ? 'Loading...' : 'View Generated Report'}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => navigate(`/appointments/${selectedEvent.id}/report`, {
                                            state: { patient: selectedEvent.patient, doctor: selectedEvent.doctor, date: selectedEvent.date, time: selectedEvent.time, specialty: selectedEvent.specialty }
                                        })} 
                                        className="btn-primary flex-1 bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                                    >
                                        <FileText size={16} className="mr-2 inline" /> Write Medical Report
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Document Viewer ── */}
            {viewingReportUrl && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-semibold text-lg text-gray-900">Patient's Medical Report</h3>
                            <button
                                onClick={() => setViewingReportUrl(null)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 bg-gray-100 p-4 relative">
                            {viewingReportUrl.includes(".pdf") ? (
                                <iframe
                                    src={viewingReportUrl}
                                    className="w-full h-full rounded-lg border-0 bg-white shadow-sm"
                                    title="PDF Viewer"
                                />
                            ) : (
                                <img
                                    src={viewingReportUrl}
                                    alt="Medical Report"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Doctor Report View Modal ── */}
            {viewingDoctorReport && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
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

            {/* Cancel Confirmation Modal */}
            <CancelConfirmationModal
                isOpen={!!cancellingId}
                onClose={() => setCancellingId(null)}
                loading={isCancelling}
                onConfirm={(reason) => handleCancel(cancellingId, reason)}
            />
        </div>
    );
}
