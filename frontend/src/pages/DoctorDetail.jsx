import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { getDoctorById, getDoctorSlots } from "../services/doctorService";
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
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoctorById(id)
      .then((res) => setDoctor(res.data))
      .catch(() => navigate("/doctors"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!selectedDate || !id) return;
    getDoctorSlots(id, selectedDate)
      .then((res) => setSlots(res.data))
      .catch(() => setSlots([]));
  }, [selectedDate, id]);

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
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                          selectedSlot === slot
                            ? "bg-brand-500 text-white shadow-[0_4px_12px_rgba(15,111,255,0.25)]"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label className="input-label">Notes (optional)</label>
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
              disabled={!selectedDate || !selectedSlot || booking}
              className="btn-primary w-full py-3 text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {booking ? "Booking..." : "Confirm Appointment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
