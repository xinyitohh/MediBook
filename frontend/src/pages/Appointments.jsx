import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments, cancelAppointment } from "../services/appointmentService";
import { mockAppointments, isDev, isDevToken } from "../dev/mockData";
import PageHeader from "../components/PageHeader";
import FilterTabs from "../components/FilterTabs";
import AppointmentRow from "../components/AppointmentRow";

const FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    if (isDev && isDevToken()) {
      const role = user?.role || "Patient";
      setAppointments(mockAppointments[role] || []);
      setLoading(false);
      return;
    }
    getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    if (isDev && isDevToken()) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
      );
      return;
    }
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel.");
    }
  };

  const filtered =
    filter === "All"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div>
      <PageHeader
        title="My Appointments"
        subtitle="Manage and track your appointments"
      >
        <button
          onClick={() => navigate("/doctors")}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Book New
        </button>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
