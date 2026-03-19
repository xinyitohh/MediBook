import { useState, useEffect, useMemo } from "react";
import {
  Stethoscope, Plus, Search, Trash2, X, Eye, EyeOff,
  ChevronDown, ChevronUp, Star, DollarSign, Users,
  Calendar, Clock, ArrowUpDown, Mail, Phone, FileText,
  BadgeCheck,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { getAllDoctors, deleteDoctor, getDoctorReviews } from "../services";
import { registerDoctor } from "../services";
import { searchAppointments } from "../services";

/* ── Constants ───────────────────────────────────── */
const SPECIALTIES = [
  "Cardiology","Dermatology","Endocrinology","Gastroenterology",
  "General Practice","Neurology","Obstetrics & Gynecology","Oncology",
  "Ophthalmology","Orthopedics","Pediatrics","Psychiatry",
  "Pulmonology","Radiology","Surgery","Urology",
];

const EMPTY_FORM = {
  fullName: "", email: "", password: "", specialty: "",
  consultationFee: "", description: "",
};

const SORT_OPTIONS = [
  { value: "name-asc",    label: "Name A–Z" },
  { value: "name-desc",   label: "Name Z–A" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "fee-asc",     label: "Fee: Low–High" },
  { value: "fee-desc",    label: "Fee: High–Low" },
  { value: "joined-desc", label: "Newest Joined" },
  { value: "joined-asc",  label: "Oldest Joined" },
];

/* ── Helpers ─────────────────────────────────────── */
const initials = (name = "") =>
  name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const badgeStatus = {
  Confirmed: "bg-mint-50 text-mint-600",
  Pending:   "bg-amber-50 text-amber-500",
  Completed: "bg-brand-50 text-brand-500",
  Cancelled: "bg-red-50 text-red-500",
};

/* ═══════════════════════════════════════════════════ */
export default function ManageDoctors() {
  const [doctors, setDoctors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState("name-asc");
  const [showModal, setShowModal]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);   // profile drawer
  const [form, setForm]             = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState("");

  useEffect(() => { fetchDoctors(); }, []);

  async function fetchDoctors() {
    setLoading(true);
    try {
      const res = await getAllDoctors();
      setDoctors(res.data ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    try {
      await deleteDoctor(deleteTarget.id);
      setDoctors((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      if (viewTarget?.id === deleteTarget.id) setViewTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete doctor.");
    } finally { setDeleteTarget(null); }
  }

  async function handleAddDoctor(e) {
    e.preventDefault();
    setFormError("");
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim() || !form.specialty) {
      setFormError("Full name, email, password and specialty are required.");
      return;
    }
    setSubmitting(true);
    try {
      await registerDoctor({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        specialty: form.specialty,
        consultationFee: form.consultationFee ? parseFloat(form.consultationFee) : null,
        description: form.description.trim() || null,
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchDoctors();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add doctor.");
    } finally { setSubmitting(false); }
  }

  /* ── Derived stats ── */
  const stats = useMemo(() => {
    const rated    = doctors.filter((d) => d.rating > 0);
    const avgRating = rated.length
      ? (rated.reduce((s, d) => s + d.rating, 0) / rated.length).toFixed(1)
      : "—";
    const specialties = [...new Set(doctors.map((d) => d.specialty).filter(Boolean))].length;
    return {
      total:      doctors.length,
      avgRating,
      specialties,
      withFee:    doctors.filter((d) => d.consultationFee).length,
    };
  }, [doctors]);

  /* ── Filtered + sorted ── */
  const displayed = useMemo(() => {
    let list = doctors.filter(
      (d) =>
        d.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty?.toLowerCase().includes(search.toLowerCase()) ||
        d.email?.toLowerCase().includes(search.toLowerCase())
    );
    const [field, dir] = sort.split("-");
    list = [...list].sort((a, b) => {
      if (field === "name")   return dir === "asc" ? a.fullName?.localeCompare(b.fullName) : b.fullName?.localeCompare(a.fullName);
      if (field === "rating") return dir === "desc" ? (b.rating || 0) - (a.rating || 0) : (a.rating || 0) - (b.rating || 0);
      if (field === "fee")    return dir === "asc"  ? (a.consultationFee || 0) - (b.consultationFee || 0) : (b.consultationFee || 0) - (a.consultationFee || 0);
      if (field === "joined") return dir === "desc"
        ? new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        : new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      return 0;
    });
    return list;
  }, [doctors, search, sort]);

  return (
    <div>
      <PageHeader
        title="Manage Doctors"
        subtitle={`${doctors.length} registered doctor${doctors.length !== 1 ? "s" : ""}`}
      >
        <button
          onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(""); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Doctor
        </button>
      </PageHeader>

      {/* ── Stats ── */}
      {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatMini icon={Stethoscope} color="brand"  label="Total Doctors"  value={stats.total} />
          <StatMini icon={Star}        color="amber"  label="Avg Rating"     value={stats.avgRating} />
          <StatMini icon={BadgeCheck}  color="mint"   label="Specialties"    value={stats.specialties} />
          <StatMini icon={DollarSign}  color="purple" label="With Fee Set"   value={stats.withFee} />
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, specialty or email…"
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
          <Stethoscope size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-gray-500">
            {search ? "No doctors match your search" : "No doctors registered yet"}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <Th>Doctor</Th>
                <Th>Specialty</Th>
                <Th hide="md">Email</Th>
                <Th hide="lg">Fee</Th>
                <Th hide="lg">Rating</Th>
                <Th hide="xl">Joined</Th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setViewTarget(doc)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {initials(doc.fullName)}
                      </div>
                      <span className="font-semibold text-heading">{doc.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{doc.specialty || "—"}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{doc.email}</td>
                  <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">
                    {doc.consultationFee ? `RM ${doc.consultationFee}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    {doc.rating ? (
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star size={12} className="fill-amber-400" />
                        {Number(doc.rating).toFixed(1)}
                      </span>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs hidden xl:table-cell">
                    {fmtDate(doc.createdAt)}
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setDeleteTarget(doc)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-auto"
                      title="Delete doctor"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Doctor Profile Drawer ── */}
      {viewTarget && (
        <DoctorDrawer
          doctor={viewTarget}
          onClose={() => setViewTarget(null)}
          onDelete={(doc) => { setDeleteTarget(doc); setViewTarget(null); }}
        />
      )}

      {/* ── Add Doctor Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-heading">Add New Doctor</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddDoctor} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">{formError}</div>
              )}
              <div>
                <label className="input-label">Full Name *</label>
                <input type="text" placeholder="Dr. John Smith" value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Email *</label>
                <input type="email" placeholder="doctor@medibook.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Minimum 8 characters"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="input-label">Specialty *</label>
                <div className="relative">
                  <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    className="input-field appearance-none pr-9">
                    <option value="">Select specialty…</option>
                    {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="input-label">Consultation Fee (RM)</label>
                <input type="number" min="0" step="0.01" placeholder="e.g. 150" value={form.consultationFee}
                  onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea rows={3} placeholder="Brief bio or professional description…" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Adding…" : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.fullName}
          type="doctor"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

/* ── Doctor detail side drawer ───────────────────── */
function DoctorDrawer({ doctor, onClose, onDelete }) {
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews]           = useState([]);
  const [tab, setTab]                   = useState("info"); // info | schedule | reviews
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [loadingRevs, setLoadingRevs]   = useState(false);

  useEffect(() => {
    if (tab === "schedule" && appointments.length === 0) {
      setLoadingAppts(true);
      searchAppointments({ doctorId: doctor.id })
        .then((r) => setAppointments(r.data ?? []))
        .catch(() => {})
        .finally(() => setLoadingAppts(false));
    }
    if (tab === "reviews" && reviews.length === 0) {
      setLoadingRevs(true);
      getDoctorReviews(doctor.id)
        .then((r) => setReviews(r.data ?? []))
        .catch(() => {})
        .finally(() => setLoadingRevs(false));
    }
  }, [tab]);

  const apptStats = useMemo(() => ({
    total:     appointments.length,
    completed: appointments.filter((a) => a.status === "Completed").length,
    upcoming:  appointments.filter((a) => a.status === "Confirmed" || a.status === "Pending").length,
  }), [appointments]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-y-auto flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-lg text-heading">Doctor Profile</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(doctor)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} /> Delete
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Doctor card */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-extrabold text-lg shrink-0">
              {initials(doctor.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-extrabold text-heading">{doctor.fullName}</h4>
              <p className="text-sm text-brand-500 font-semibold">{doctor.specialty || "—"}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Mail size={12} />{doctor.email}</span>
                {doctor.phoneNumber && <span className="flex items-center gap-1"><Phone size={12} />{doctor.phoneNumber}</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <MiniStat label="Rating" value={doctor.rating ? `★ ${Number(doctor.rating).toFixed(1)}` : "—"} />
            <MiniStat label="Fee" value={doctor.consultationFee ? `RM ${doctor.consultationFee}` : "—"} />
            <MiniStat label="Joined" value={fmtDate(doctor.createdAt)} small />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 shrink-0">
          {[["info", "Info"], ["schedule", "Schedule"], ["reviews", "Reviews"]].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === k ? "border-brand-500 text-brand-500" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 px-6 py-5">
          {tab === "info" && (
            <div className="space-y-4">
              {doctor.description && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">About</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{doctor.description}</p>
                </div>
              )}
              <InfoRow label="Review Count" value={doctor.reviewCount ?? "—"} />
              <InfoRow label="Consultation Fee" value={doctor.consultationFee ? `RM ${doctor.consultationFee}` : "Not set"} />
              <InfoRow label="Joined" value={fmtDate(doctor.createdAt)} />
              <InfoRow label="Email" value={doctor.email} />
              {doctor.phoneNumber && <InfoRow label="Phone" value={doctor.phoneNumber} />}
            </div>
          )}

          {tab === "schedule" && (
            loadingAppts ? <Spinner /> :
            appointments.length === 0 ? (
              <Empty icon={Calendar} text="No appointments found" />
            ) : (
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <MiniStat label="Total"     value={apptStats.total} />
                  <MiniStat label="Completed" value={apptStats.completed} />
                  <MiniStat label="Upcoming"  value={apptStats.upcoming} />
                </div>
                {appointments.slice(0, 20).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-heading truncate">{a.patient}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={11} />{a.date} <Clock size={11} className="ml-1" />{a.time}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${badgeStatus[a.status] || "bg-gray-100 text-gray-500"}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "reviews" && (
            loadingRevs ? <Spinner /> :
            reviews.length === 0 ? (
              <Empty icon={Star} text="No reviews yet" />
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-heading">{r.patientName || "Patient"}</p>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={11} className={s <= r.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-xs text-gray-500 leading-relaxed">{r.comment}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">{fmtDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small reusable pieces ───────────────────────── */
function StatMini({ icon: Icon, color, label, value }) {
  const colors = {
    brand:  "bg-brand-50 text-brand-500",
    amber:  "bg-amber-50 text-amber-500",
    mint:   "bg-mint-50 text-mint-500",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="card-padded flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xl font-extrabold text-heading leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, small }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
      <p className={`font-bold text-heading ${small ? "text-xs" : "text-sm"}`}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-50">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-sm text-gray-700 text-right">{value}</span>
    </div>
  );
}

function Th({ children, hide }) {
  const hideCls = hide === "md" ? "hidden md:table-cell" : hide === "lg" ? "hidden lg:table-cell" : hide === "xl" ? "hidden xl:table-cell" : "";
  return (
    <th className={`text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${hideCls}`}>
      {children}
    </th>
  );
}

function Spinner() {
  return (
    <div className="py-10 flex justify-center">
      <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
}

function Empty({ icon: Icon, text }) {
  return (
    <div className="py-10 text-center text-gray-400">
      <Icon size={28} className="mx-auto mb-2 opacity-30" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

function ConfirmDelete({ name, type, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="font-bold text-lg text-heading mb-1">Delete {type === "doctor" ? "Doctor" : "Patient"}?</h3>
        <p className="text-sm text-gray-500 mb-5">
          Are you sure you want to remove <span className="font-semibold text-gray-700">{name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-outline flex-1">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] transition-all cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
