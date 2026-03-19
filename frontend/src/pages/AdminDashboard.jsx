import { useState, useEffect } from "react";
import { Users, Stethoscope, Calendar, Clock, Loader2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { getAdminStats } from "../services"; // Import the real API service

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Call the real C# API
        const response = await getAdminStats();

        // 2. Set the data into state
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        setError("Failed to load real-time system data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show a spinner while fetching data from your local/RDS database
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: "Total Patients",
      value: stats?.totalPatients?.toLocaleString() || "0",
      sub: "Live from database",
      color: "brand",
    },
    {
      icon: Stethoscope,
      label: "Total Doctors",
      value: String(stats?.totalDoctors || "0"),
      sub: "Active practitioners",
      color: "purple",
    },
    {
      icon: Calendar,
      label: "Appointments Today",
      value: String(stats?.appointmentsToday || "0"),
      sub: "Scheduled for today",
      color: "mint",
    },
    {
      icon: Clock,
      label: "Pending Approvals",
      value: String(stats?.pendingApprovals || "0"),
      sub: "Needs attention",
      color: "amber",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="System overview and management"
      />

      {/* Stats Cards - Now Dynamic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Recent Activity - Now fetching from backend RecentActivityDto */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-heading">Recent Activity</h3>
        </div>

        {stats?.recentActivity?.length > 0 ? (
          stats.recentActivity.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3.5 px-6 py-3.5 ${
                i < stats.recentActivity.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-heading">
                  {item.action}
                </p>
                <p className="text-sm text-gray-500">{item.detail}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {item.time}
              </span>
            </div>
          ))
        ) : (
          <div className="px-6 py-10 text-center text-gray-400">
            No recent system activity found.
          </div>
        )}
      </div>
    </div>
  );
}
