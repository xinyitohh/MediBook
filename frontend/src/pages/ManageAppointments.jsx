import { useState, useEffect, useMemo } from "react";
import {
  Calendar, Search, ArrowUpDown, ChevronDown,
  CheckCircle, CircleCheck, X, Clock, User, Stethoscope,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import FilterTabs from "../components/FilterTabs";
import {
  getAllAppointments,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
} from "../services";

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Date: Newest" },
  { value: "date-asc",  label: "Date: Oldest" },
  { value: "name-asc",  label: "Patient A–Z" },
  { value: "name-desc", label: "Patient Z–A" },
];

const badgeClasses = {
  Confirmed: "badge-confirmed",
  Pending:   "badge-pending",
  Completed: "badge-completed",
  Cancelled: "badge-cancelled",
};

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("All");
  const [search, setSearch]             = useState("");
  const [sort, setSort]                 = useState("date-desc");

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await getAllAppointments();
      setAppointments(res.data ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function handleConfirm(id) {
    try {
      await confirmAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Confirmed" } : a))
      );
    } catch (err) { alert(err.response?.data?.message || "Failed to confirm."); }
  }

  async function handleComplete(id, notes) {
    try {
      await completeAppointment(id,{ doctorNotes: notes });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Completed" } : a))
      );
    } catch (err) { alert(err.response?.data?.message || "Failed to complete."); }
  }

  async function handleCancel(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
      );
    } catch (err) { alert(err.response?.data?.message || "Failed to cancel."); }
  }

  /* ── Derived stats ── */
  const stats = useMemo(() => ({
    total:     appointments.length,
    pending:   appointments.filter((a) => a.status === "Pending").length,
    confirmed: appointments.filter((a) => a.status === "Confirmed").length,
    completed: appointments.filter((a) => a.status === "Completed").length,
  }), [appointments]);

  /* ── Filtered + sorted ── */
  const displayed = useMemo(() => {
    let list = appointments.filter((a) => {
      const matchStatus = filter === "All" || a.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        a.patient?.toLowerCase().includes(q) ||
        a.doctor?.toLowerCase().includes(q) ||
        a.specialty?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });

    const [field, dir] = sort.split("-");
    return [...list].sort((a, b) => {
      if (field === "date") {
        const da = new Date(`${a.date} ${a.time || "00:00"}`);
        const db = new Date(`${b.date} ${b.time || "00:00"}`);
        return dir === "desc" ? db - da : da - db;
      }
      if (field === "name") {
        return dir === "asc"
          ? a.patient?.localeCompare(b.patient)
          : b.patient?.localeCompare(a.patient);
      }
      return 0;
    });
  }, [appointments, filter, search, sort]);

  return (
    <div>
      <PageHeader
        title="Manage Appointments"
        subtitle="View and manage all system appointments"
      />

      {/* ── Stats ── */}
      {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatMini label="Total"     value={stats.total}     color="brand"  />
          <StatMini label="Pending"   value={stats.pending}   color="amber"  />
          <StatMini label="Confirmed" value={stats.confirmed} color="mint"   />
          <StatMini label="Completed" value={stats.completed} color="purple" />
        </div>
      )}

      {/* ── Filter tabs ── */}
      <FilterTabs tabs={STATUS_FILTERS} active={filter} onChange={setFilter} />

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3 mb-5 mt-4">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patient, doctor or specialty…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="relative">
          <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field pl-8 pr-8 appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="card p-8 flex justify-center">
          <div className="w-7 h-7 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="card p-16 text-center text-gray-400">
          <Calendar size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-gray-500">
            {search || filter !== "All" ? "No appointments match your filter" : "No appointments found"}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <Th>Patient</Th>
                <Th>Doctor</Th>
                <Th hide="md">Specialty</Th>
                <Th hide="lg">Date</Th>
                <Th hide="lg">Time</Th>
                <Th>Status</Th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map((appt) => (
                <AppointmentAdminRow
                  key={appt.id}
                  appt={appt}
                  onConfirm={handleConfirm}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Table row ───────────────────────────────────── */
function AppointmentAdminRow({ appt, onConfirm, onComplete, onCancel }) {
  const { id, patient, doctor, specialty, date, time, status } = appt;
  const canAct = status === "Pending" || status === "Confirmed";

  const patientInitials = (patient || "")
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs shrink-0">
            {patientInitials}
          </div>
          <span className="font-semibold text-heading text-sm">{patient || "—"}</span>
        </div>
      </td>
      <td className="px-5 py-3.5 text-gray-600 text-sm">{doctor || "—"}</td>
      <td className="px-5 py-3.5 text-gray-500 text-sm hidden md:table-cell">{specialty || "—"}</td>
      <td className="px-5 py-3.5 hidden lg:table-cell">
        <span className="flex items-center gap-1.5 text-sm text-gray-600">
          <Calendar size={13} className="text-gray-400" />{date || "—"}
        </span>
      </td>
      <td className="px-5 py-3.5 hidden lg:table-cell">
        <span className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock size={13} className="text-gray-400" />{time || "—"}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className={badgeClasses[status] || "badge bg-gray-100 text-gray-500"}>
          {status}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1">
          {status === "Pending" && (
            <button
              onClick={() => onConfirm(id)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-brand-50 text-brand-500 hover:bg-brand-100 border border-brand-200 transition-colors cursor-pointer"
              title="Confirm"
            >
              <CheckCircle size={12} /> Confirm
            </button>
          )}
          {status === "Confirmed" && (
            <button
              onClick={() => onComplete(id)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-mint-50 text-mint-600 hover:bg-mint-100 border border-mint-200 transition-colors cursor-pointer"
              title="Complete"
            >
              <CircleCheck size={12} /> Complete
            </button>
          )}
          {canAct && (
            <button
              onClick={() => onCancel(id)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              title="Cancel"
            >
              <X size={12} /> Cancel
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ── Shared pieces ───────────────────────────────── */
function StatMini({ label, value, color }) {
  const colors = {
    brand:  "bg-brand-50 text-brand-500",
    amber:  "bg-amber-50 text-amber-500",
    mint:   "bg-mint-50 text-mint-500",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className={`card-padded flex items-center justify-between`}>
      <div>
        <p className="text-2xl font-extrabold text-heading leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Calendar size={18} />
      </div>
    </div>
  );
}

function Th({ children, hide }) {
  const hideCls = hide === "md" ? "hidden md:table-cell" : hide === "lg" ? "hidden lg:table-cell" : "";
  return (
    <th className={`text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${hideCls}`}>
      {children}
    </th>
  );
}
