import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, CheckCircle, MessageSquare } from "lucide-react";
import { getDoctorById, getAvailableSlots, getDoctorReviews } from "../services";
import { bookAppointment } from "../services/appointmentService";
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
    const [slotLoading, setSlotLoading] = useState(false);
    const [booking, setBooking] = useState(false);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [reviews, setReviews] = useState([]);

    // 🔹 Block past dates
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];

    // 🔹 Fetch doctor
    useEffect(() => {
        getDoctorById(id)
            .then((res) => setDoctor(res.data))
            .catch(() => navigate("/doctors"))
            .finally(() => setLoading(false));

        getDoctorReviews(id)
            .then((res) => setReviews(res.data ?? []))
            .catch(() => { });
    }, [id]);

    // 🔹 Fetch slots
    useEffect(() => {
        if (!selectedDate || !id) return;

        setSlotLoading(true);

        getAvailableSlots(id, selectedDate)
            .then((res) => setSlots(res.data))
            .catch(() => setSlots([]))
            .finally(() => setSlotLoading(false));
    }, [selectedDate, id]);

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

    // 🔹 Booking
    const handleBook = async () => {
        if (!selectedDate || !selectedSlot) return;

        setBooking(true);
        setError("");

        try {
            await bookAppointment({
                doctorId: parseInt(id),
                appointmentDate: selectedDate,
                timeSlot: selectedSlot,
                notes,
            });

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed.");
        } finally {
            setBooking(false);
        }
    };

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

    // 🔹 Success screen
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
                    <span className="font-semibold">
                        {formatTime(selectedSlot)}
                    </span>{" "}
                    has been submitted.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate("/appointments")}
                        className="btn-primary"
                    >
                        View My Appointments
                    </button>

                    <button
                        onClick={() => navigate("/doctors")}
                        className="btn-outline"
                    >
                        Browse Doctors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Back */}
            <button
                onClick={() => navigate("/doctors")}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft size={16} />
                Back to Doctors
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Doctor Profile */}
                <div>
                    <div className="card-padded text-center">
                        {doctor.profileImageUrl ? (
                            <img
                                src={doctor.profileImageUrl}
                                alt={doctor.fullName}
                                className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-4">
                                {initials}
                            </div>
                        )}

                        <h2 className="text-xl font-extrabold">{doctor.fullName}</h2>
                        <p className="text-sm text-gray-500 mb-3">{doctor.specialty}</p>

                        <div className="flex justify-center gap-1 mb-3">
                            <Star size={16} className="text-amber-400 fill-amber-400" />
                            <span>{doctor.rating || "4.8"}</span>
                        </div>

                        {doctor.consultationFee && (
                            <p className="text-lg font-bold text-brand-500">
                                RM {doctor.consultationFee}
                            </p>
                        )}
                    </div>
                </div>

                {/* Booking */}
                <div className="lg:col-span-2">
                    <div className="card-padded">
                        <h3 className="text-lg font-bold mb-4">Book an Appointment</h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
                                {error}
                            </div>
                        )}

                        {/* Date */}
                        <DatePicker
                            minDate={minDate}
                            value={selectedDate}
                            onChange={(val) => {
                                setSelectedDate(val);
                                setSelectedSlot("");
                            }}
                        />

                        {/* Slots */}
                        {selectedDate && (
                            <div className="mt-4">
                                <label className="text-sm font-medium">
                                    Available Time Slots
                                </label>

                                {slotLoading ? (
                                    <p className="text-gray-400 text-sm py-4">
                                        Loading slots...
                                    </p>
                                ) : slots.length === 0 ? (
                                    <p className="text-gray-400 text-sm py-4">
                                        No available slots for this date.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                                        {slots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 rounded-xl text-sm font-semibold ${selectedSlot === slot
                                                        ? "bg-brand-500 text-white"
                                                        : "bg-gray-100 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {formatTime(slot)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notes */}
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional notes..."
                            className="w-full mt-4 p-3 border rounded-xl text-sm"
                        />

                        {/* Button */}
                        <button
                            onClick={handleBook}
                            disabled={!selectedDate || !selectedSlot || booking}
                            className="btn-primary w-full mt-4"
                        >
                            {booking ? "Booking..." : "Confirm Appointment"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}