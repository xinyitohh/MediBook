import { useState, useEffect } from "react";
import { Users, Stethoscope, Calendar, Clock } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call — getAdminDashboard()
    setTimeout(() => {
      setStats({
        totalPatients: 1234,
        totalDoctors: 48,
        appointmentsToday: 67,
        pendingApprovals: 15,
      });
      setLoading(false);
    }, 300);
  }, []);

  const recentActivity = [
    { action: "New patient registered", detail: "Ahmad Ibrahim", time: "2 min ago", color: "bg-brand-500" },
    { action: "Appointment confirmed", detail: "Dr. Sarah Johnson → Jane Doe", time: "15 min ago", color: "bg-mint-500" },
    { action: "Medical report uploaded", detail: "Patient: Mike Ross", time: "1 hour ago", color: "bg-purple-500" },
    { action: "Appointment cancelled", detail: "Dr. Chen → Alice Tan", time: "2 hours ago", color: "bg-red-500" },
    { action: "New doctor added", detail: "Dr. Emily Wong — Pediatrics", time: "3 hours ago", color: "bg-amber-500" },
  ];

  const statCards = [
    { icon: Users,       label: "Total Patients",      value: stats?.totalPatients?.toLocaleString() || "–",  sub: "+12% this month", color: "brand" },
    { icon: Stethoscope, label: "Total Doctors",        value: String(stats?.totalDoctors || "–"),              sub: "+3 this month",   color: "purple" },
    { icon: Calendar,    label: "Appointments Today",   value: String(stats?.appointmentsToday || "–"),         sub: "+8% vs yesterday",color: "mint" },
    { icon: Clock,       label: "Pending Approvals",    value: String(stats?.pendingApprovals || "–"),          sub: "Needs attention", color: "amber" },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="System overview and management"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-heading">Recent Activity</h3>
        </div>
        {recentActivity.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3.5 px-6 py-3.5 ${
              i < recentActivity.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-heading">{item.action}</p>
              <p className="text-sm text-gray-500">{item.detail}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
