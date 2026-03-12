import { useState, useEffect } from "react";
import { Calendar, Heart, FileText, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments } from "../services";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import AppointmentRow from "../components/AppointmentRow";

export default function Home() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(
    (a) => a.status === "Confirmed" || a.status === "Pending"
  );
  const completed = appointments.filter((a) => a.status === "Completed");
  const firstName = user?.fullName?.split(" ")[0] || "there";

  const stats = [
    { icon: Calendar, label: "Upcoming",  value: String(upcoming.length),   sub: "Appointments", color: "brand" },
    { icon: Heart,    label: "Completed", value: String(completed.length),  sub: "This month",   color: "mint" },
    { icon: FileText, label: "Reports",   value: "–",                       sub: "Uploaded",     color: "purple" },
    { icon: Bell,     label: "Reminders", value: "0",                       sub: "Pending",      color: "amber" },
  ];

  return (
    <div>
      <PageHeader
        title={`Good morning, ${firstName} 👋`}
        subtitle="Here's what's happening with your health today"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-heading">
            Upcoming Appointments
          </h3>
          <button className="text-sm font-semibold text-brand-500 bg-brand-50 px-4 py-2 rounded-lg hover:bg-brand-100 transition-colors">
            View All
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : upcoming.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No upcoming appointments.{" "}
            <a href="/doctors" className="text-brand-500 font-semibold hover:underline">
              Book one now
            </a>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {upcoming.slice(0, 5).map((appt) => (
              <AppointmentRow key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
