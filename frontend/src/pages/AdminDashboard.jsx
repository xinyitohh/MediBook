import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  Loader2,
  Stethoscope,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { getAdminDashboardAnalytics } from "../services";

const AdminDashboardCharts = lazy(() =>
  import("../components/AdminDashboardCharts")
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardAnalytics();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => dashboardData?.stats || {}, [dashboardData]);
  const charts = useMemo(() => dashboardData?.charts || {}, [dashboardData]);

  const handleChartNavigate = (target, query = {}) => {
    const search = new URLSearchParams(
      Object.entries(query).filter(([, value]) =>
        value !== null && value !== undefined && String(value).trim() !== ""
      )
    ).toString();

    const basePath =
      target === "doctors"
        ? "/admin/doctors"
        : target === "patients"
          ? "/admin/patients"
          : "/admin/appointments";

    navigate(search ? `${basePath}?${search}` : basePath);
  };

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

      <Suspense
        fallback={
          <div className="card p-6 mb-6">
            <div className="h-80 flex items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
            </div>
          </div>
        }
      >
        <AdminDashboardCharts
          charts={charts}
          onNavigate={handleChartNavigate}
        />
      </Suspense>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-heading flex items-center gap-2">
            <BarChart3 size={16} className="text-brand-500" />
            Recent Activity
          </h3>
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
