import { useState, useEffect } from "react";
import { getDoctors } from "../services/doctorService";
import {
  getMyAppointments,
  bookAppointment,
  cancelAppointment,
} from "../services/appointmentService";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    doctorId: "",
    appointmentDate: "",
    timeSlot: "",
    notes: "",
  });

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  useEffect(() => {
    Promise.all([getMyAppointments(), getDoctors()])
      .then(([apptRes, docRes]) => {
        setAppointments(apptRes.data);
        setDoctors(docRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await bookAppointment({
        ...form,
        doctorId: parseInt(form.doctorId),
      });
      setSuccess("Appointment booked successfully!");
      setShowForm(false);
      const res = await getMyAppointments();
      setAppointments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      setAppointments(
        appointments.map((a) =>
          a.id === id ? { ...a, status: "Cancelled" } : a,
        ),
      );
    } catch (err) {
      setError("Failed to cancel appointment.");
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      Pending: "warning",
      Confirmed: "success",
      Cancelled: "danger",
    };
    return `badge bg-${map[status] || "secondary"}`;
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📅 My Appointments</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Book Appointment"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Booking Form */}
      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">Book New Appointment</h5>
            <form onSubmit={handleBook}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Select Doctor</label>
                  <select
                    className="form-select"
                    value={form.doctorId}
                    onChange={(e) =>
                      setForm({ ...form, doctorId: e.target.value })
                    }
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName} - {d.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.appointmentDate}
                    onChange={(e) =>
                      setForm({ ...form, appointmentDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Time Slot</label>
                  <select
                    className="form-select"
                    value={form.timeSlot}
                    onChange={(e) =>
                      setForm({ ...form, timeSlot: e.target.value })
                    }
                    required
                  >
                    <option value="">Choose a time...</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Notes (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    placeholder="Describe your symptoms..."
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-success">
                    Confirm Booking
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <p>No appointments yet. Book your first appointment!</p>
        </div>
      ) : (
        <div className="row g-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title">{appt.doctorName}</h6>
                    <span className={getStatusBadge(appt.status)}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-muted small mb-1">
                    {appt.doctorSpecialty}
                  </p>
                  <p className="mb-1">
                    📅 {new Date(appt.appointmentDate).toLocaleDateString()}
                    &nbsp;at&nbsp; 🕐 {appt.timeSlot}
                  </p>
                  {appt.notes && (
                    <p className="small text-muted">📝 {appt.notes}</p>
                  )}
                  {appt.status === "Pending" && (
                    <button
                      className="btn btn-outline-danger btn-sm mt-2"
                      onClick={() => handleCancel(appt.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
