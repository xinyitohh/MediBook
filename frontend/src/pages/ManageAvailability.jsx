import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { Clock, CheckCircle2, CalendarOff, Plus, Trash2 } from "lucide-react";
import { getDoctorProfile, updateDoctorProfile, getDoctorSchedule, updateDoctorSchedule } from "../services/doctorService";
import DatePicker from "../components/DatePicker";

export default function ManageAvailability() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [globalDuration, setGlobalDuration] = useState(30);

    const defaultDays = [
        { dayOfWeek: 1, dayName: "Monday", isActive: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", slotDurationMinutes: 30 },
        { dayOfWeek: 2, dayName: "Tuesday", isActive: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", slotDurationMinutes: 30 },
        { dayOfWeek: 3, dayName: "Wednesday", isActive: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", slotDurationMinutes: 30 },
        { dayOfWeek: 4, dayName: "Thursday", isActive: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", slotDurationMinutes: 30 },
        { dayOfWeek: 5, dayName: "Friday", isActive: true, startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", slotDurationMinutes: 30 },
        { dayOfWeek: 6, dayName: "Saturday", isActive: false, startTime: "09:00", endTime: "13:00", breakStart: "", breakEnd: "", slotDurationMinutes: 30 },
        { dayOfWeek: 0, dayName: "Sunday", isActive: false, startTime: "09:00", endTime: "13:00", breakStart: "", breakEnd: "", slotDurationMinutes: 30 },
    ];

    const [schedules, setSchedules] = useState(defaultDays);
    const [leaveDates, setLeaveDates] = useState([]);
    const [newLeaveDate, setNewLeaveDate] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Doctor Profile to get LeaveDates
            const profileRes = await getDoctorProfile();
            if (profileRes.data) {
                // Backend sends timestamps, convert to YYYY-MM-DD
                const dates = (profileRes.data.leaveDates || []).map(d => d.split("T")[0]);
                setLeaveDates(dates);
            }

            // Fetch Schedule
            const schedRes = await getDoctorSchedule();
            if (schedRes.data && schedRes.data.length > 0) {
                const fetchedMap = new Map();
                schedRes.data.forEach(s => fetchedMap.set(s.dayOfWeek, s));

                const mergedSchedules = defaultDays.map(day => {
                    const serverDay = fetchedMap.get(day.dayOfWeek);
                    if (serverDay) {
                        return {
                            ...day,
                            isActive: serverDay.isActive,
                            startTime: serverDay.startTime || "09:00",
                            endTime: serverDay.endTime || "17:00",
                            breakStart: serverDay.breakStart || "",
                            breakEnd: serverDay.breakEnd || "",
                            slotDurationMinutes: serverDay.slotDurationMinutes || 30
                        };
                    }
                    return day;
                });

                setSchedules(mergedSchedules);

                if (schedRes.data[0]?.slotDurationMinutes) {
                    setGlobalDuration(schedRes.data[0].slotDurationMinutes);
                }
            }
        } catch (error) {
            console.error("Failed to load availability data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDayChange = (dayOfWeek, field, value) => {
        setSchedules(prev => prev.map(day => {
            if (day.dayOfWeek === dayOfWeek) {
                return { ...day, [field]: value };
            }
            return day;
        }));
    };

    const handleAddLeaveDate = () => {
        if (!newLeaveDate) return;
        if (leaveDates.includes(newLeaveDate)) {
            alert("This date is already marked as a leave day.");
            return;
        }
        setLeaveDates(prev => [...prev, newLeaveDate].sort());
        setNewLeaveDate("");
    };

    const handleRemoveLeaveDate = (dateToRemove) => {
        setLeaveDates(prev => prev.filter(d => d !== dateToRemove));
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);
        try {
            // Save Schedule
            const dataToSave = schedules.map(s => ({
                ...s,
                slotDurationMinutes: globalDuration
            }));
            await updateDoctorSchedule(dataToSave);

            // Fetch current profile to prevent overwriting other fields with empty data
            const profileRes = await getDoctorProfile();
            const currentProfile = profileRes.data;

            // Save Leave Dates
            await updateDoctorProfile({
                fullName: currentProfile.fullName || "",
                specialtyId: currentProfile.specialtyId || null,
                phone: currentProfile.phone || "",
                description: currentProfile.description || "",
                consultationFee: currentProfile.consultationFee || 0,
                dateOfBirth: currentProfile.dateOfBirth || "",
                gender: currentProfile.gender || "",
                experience: currentProfile.experience || "",
                qualifications: currentProfile.qualifications || "",
                languages: currentProfile.languages || "",
                leaveDates: leaveDates.map(d => new Date(d).toISOString()) // send as ISO strings
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            alert("Failed to save changes: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading your schedule...</div>;
    }

    return (
        <div className="pb-10 max-w-5xl mx-auto">
            <PageHeader title="Working Hours & Availability" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Weekly Schedule</h2>
                    <p className="text-sm text-gray-500 mt-1">Defines your general availability for patient bookings.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-700">Slot Duration:</label>
                        <select
                            value={globalDuration}
                            onChange={(e) => setGlobalDuration(parseInt(e.target.value))}
                            className="input-field py-1.5 w-auto"
                        >
                            <option value={30}>30 mins</option>
                            <option value={60}>60 mins</option>
                        </select>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary min-w-[120px] shadow-lg shadow-brand-500/20"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {success && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-mint-50 border border-mint-100 text-mint-600 text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Schedule successfully updated. Patients will see the new slots immediately.
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {schedules.map((schedule) => (
                        <div
                            key={schedule.dayOfWeek}
                            className={`flex flex-col sm:flex-row gap-6 px-6 py-6 transition-colors
                                ${!schedule.isActive ? 'bg-gray-50/50' : 'hover:bg-gray-50/50'}
                            `}
                        >
                            {/* Day Toggle */}
                            <div className="flex items-center gap-3 sm:w-[160px] shrink-0 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={schedule.isActive}
                                        onChange={(e) => handleDayChange(schedule.dayOfWeek, "isActive", e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                                </label>
                                <span className={`font-semibold ${schedule.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {schedule.dayName}
                                </span>
                            </div>

                            {/* Time Controls Container */}
                            <div className={`flex-1 flex flex-col gap-4 ${!schedule.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                                
                                {/* Working Hours */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider w-[120px]">Working Hours</span>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="time"
                                            value={schedule.startTime}
                                            onChange={(e) => handleDayChange(schedule.dayOfWeek, "startTime", e.target.value)}
                                            className="input-field py-1.5 w-[140px]"
                                            step="1800"
                                        />
                                        <span className="text-gray-400 font-medium">to</span>
                                        <input
                                            type="time"
                                            value={schedule.endTime}
                                            onChange={(e) => handleDayChange(schedule.dayOfWeek, "endTime", e.target.value)}
                                            className="input-field py-1.5 w-[140px]"
                                            step="1800"
                                        />
                                    </div>
                                </div>

                                {/* Break Time */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider w-[120px]">Break Time</span>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="time"
                                            value={schedule.breakStart || ""}
                                            onChange={(e) => handleDayChange(schedule.dayOfWeek, "breakStart", e.target.value)}
                                            className="input-field py-1.5 w-[140px]"
                                            step="1800"
                                        />
                                        <span className="text-gray-400 font-medium">to</span>
                                        <input
                                            type="time"
                                            value={schedule.breakEnd || ""}
                                            onChange={(e) => handleDayChange(schedule.dayOfWeek, "breakEnd", e.target.value)}
                                            className="input-field py-1.5 w-[140px]"
                                            step="1800"
                                        />
                                        {(!schedule.breakStart && !schedule.breakEnd) && (
                                            <span className="text-xs text-gray-400 font-medium ml-2">(Optional)</span>
                                        )}
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Specific Leave Dates Section --- */}
            <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                        <CalendarOff size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Specific Leave Dates</h2>
                        <p className="text-sm text-gray-500">Block off specific calendar dates (e.g., holidays) from booking.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-[200px]">
                        <DatePicker
                            value={newLeaveDate}
                            onChange={(val) => setNewLeaveDate(val)}
                            minDate={new Date()}
                        />
                    </div>
                    <button 
                        onClick={handleAddLeaveDate}
                        disabled={!newLeaveDate}
                        className="btn-outline flex items-center justify-center gap-2 border-brand-200 text-brand-600 hover:bg-brand-50"
                    >
                        <Plus size={18} /> Add Leave Date
                    </button>
                </div>

                {leaveDates.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {leaveDates.map((date, idx) => {
                            const dateObj = new Date(date);
                            const formatted = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                            return (
                                <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <span className="text-sm font-semibold text-gray-700">{formatted}</span>
                                    <button 
                                        onClick={() => handleRemoveLeaveDate(date)}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                        title="Remove Leave Date"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                        <p className="text-sm text-gray-400">No specific leave dates added yet.</p>
                    </div>
                )}
            </div>
            
        </div>
    );
}
