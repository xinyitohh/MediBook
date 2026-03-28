import { useState, useEffect, useMemo } from "react";
import {
  Users, Plus, Search, Trash2, X, Calendar, FileText,
  ChevronDown, Heart, Mail, Phone, Droplets, ArrowUpDown, BadgeCheck,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import DatePicker from "../components/DatePicker";
import { getAllPatients, deletePatient, getPatientProfileById } from "../services";
import { adminRegisterPatient } from "../services/patientService";
import { searchAppointments } from "../services";

/* ── Helpers ─────────────────────────────────────── */
const initials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const AVATAR_COLORS = [
  "bg-brand-50 text-brand-600",
  "bg-purple-50 text-purple-600",
  "bg-mint-50 text-mint-600",
  "bg-orange-50 text-orange-600",
  "bg-amber-50 text-amber-600",
];

const SORT_OPTIONS = [
  { value: "name-asc",    label: "Name A–Z" },
  { value: "name-desc",   label: "Name Z–A" },
  { value: "joined-desc", label: "Newest Joined" },
  { value: "joined-asc",  label: "Oldest Joined" },
  { value: "dob-asc",     label: "Youngest First" },
  { value: "dob-desc",    label: "Oldest First" },
];

const badgeStatus = {
  Confirmed: "bg-mint-50 text-mint-600",
  Pending:   "bg-amber-50 text-amber-500",
  Completed: "bg-brand-50 text-brand-500",
  Cancelled: "bg-red-50 text-red-500",
};

/* ═══════════════════════════════════════════════════ */
export default function ManagePatients() {
  const [patients, setPatients]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [sort, setSort]                 = useState("name-asc");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget]     = useState(null);
  const [showModal, setShowModal] = useState(false);
  const EMPTY_PATIENT_FORM = { fullName: "", email: "", phone: "", dob: "", gender: "" };
  const [form, setForm] = useState(EMPTY_PATIENT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => { fetchPatients(); }, []);

  async function fetchPatients() {
    setLoading(true);
    try {
      const res = await getAllPatients();
      setPatients(res.data ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    try {
      await deletePatient(deleteTarget.id);
      setPatients((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      if (viewTarget?.id === deleteTarget.id) setViewTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete patient.");
    } finally { setDeleteTarget(null); }
  }

  async function handleAddPatient(e) {
    e.preventDefault();
    setFormError("");
    if (!form.fullName.trim() || !form.email.trim()) {
      setFormError("Full name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      await adminRegisterPatient({
        FullName: form.fullName.trim(),
        Email: form.email.trim(),
        Phone: form.phone.trim() || "",
        DateOfBirth: form.dob || "",
        Gender: form.gender || "",
        // other optional fields in PatientDto are omitted here but backend will accept empty strings
      });
      setShowModal(false);
      setForm(EMPTY_PATIENT_FORM);
  await fetchPatients();
  setSuccessMessage("Patient account created and set-password email dispatched.");
  setSuccessModal(true);
    } catch (err) {
      // Try to extract useful info from problem details or validation errors
      const data = err.response?.data;
      let msg = "Failed to create patient.";
      if (data) {
        if (data.errors) {
          // ASP.NET validation errors object -> join messages
          const all = Object.values(data.errors).flat();
          msg = all.join(" ");
        } else if (data.title) {
          msg = data.title + (data.detail ? ": " + data.detail : "");
        } else if (data.message) {
          msg = data.message;
        }
      }
      setFormError(msg);
    } finally { setSubmitting(false); }
  }

  /* ── Derived stats ── */
  const stats = useMemo(() => {
    const withBlood  = patients.filter((p) => p.bloodType).length;
  const withPhone  = patients.filter((p) => p.phone).length;
    const thisMonth  = patients.filter((p) => {
      if (!p.createdAt) return false;
      const d = new Date(p.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total: patients.length, withBlood, withPhone, thisMonth };
  }, [patients]);

  /* ── Filtered + sorted ── */
  const displayed = useMemo(() => {
    let list = patients.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase()) ||
  p.phone?.includes(search)
    );
    const [field, dir] = sort.split("-");
    list = [...list].sort((a, b) => {
      if (field === "name")   return dir === "asc" ? a.fullName?.localeCompare(b.fullName) : b.fullName?.localeCompare(a.fullName);
      if (field === "joined") return dir === "desc"
        ? new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        : new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (field === "dob")    return dir === "asc"
        ? new Date(b.dateOfBirth || 0) - new Date(a.dateOfBirth || 0)   // younger = later dob
        : new Date(a.dateOfBirth || 0) - new Date(b.dateOfBirth || 0);
      return 0;
    });
    return list;
  }, [patients, search, sort]);

  return (
    <div>
      <PageHeader
        title="Manage Patients"
        subtitle={`${patients.length} registered patient${patients.length !== 1 ? "s" : ""}`}
      >
        <button onClick={() => { setShowModal(true); setForm(EMPTY_PATIENT_FORM); setFormError(""); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Patient
        </button>
      </PageHeader>

      {/* ── Stats ── */}
      {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatMini icon={Users}    color="brand"  label="Total Patients" value={stats.total} />
          <StatMini icon={Calendar} color="mint"   label="Joined This Month" value={stats.thisMonth} />
          <StatMini icon={Phone}    color="purple" label="With Phone"     value={stats.withPhone} />
          <StatMini icon={Droplets} color="red"    label="Blood Type Set" value={stats.withBlood} />
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email or phone…"
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
          <Users size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-gray-500">
            {search ? "No patients match your search" : "No patients registered yet"}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <Th>Patient</Th>
                  <Th hide="md">Email</Th>
                  <Th hide="lg">Phone</Th>
                  <Th hide="lg">Date of Birth</Th>
                  <Th hide="xl">Blood Type</Th>
                  <Th hide="xl">Joined</Th>
                  <Th>Status</Th>
                  <th className="px-5 py-3" />
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map((patient, idx) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setViewTarget(patient)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                        {initials(patient.fullName)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-heading truncate">{patient.fullName}</p>
                        {patient.gender && <p className="text-xs text-gray-400">{patient.gender}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{patient.email}</td>
                  <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">{patient.phone || "—"}</td>
                  <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">{fmtDate(patient.dateOfBirth)}</td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    {patient.bloodType
                      ? <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold">{patient.bloodType}</span>
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs hidden xl:table-cell">{fmtDate(patient.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    {patient.emailConfirmed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-mint-50 text-mint-600">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Inactive</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setDeleteTarget(patient)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-auto"
                      title="Delete patient"
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

      {/* ── Patient Profile Drawer ── */}
      {viewTarget && (
        <PatientDrawer
          patient={viewTarget}
          onClose={() => setViewTarget(null)}
          onDelete={(p) => { setDeleteTarget(p); setViewTarget(null); }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.fullName}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* ── Success Modal ── */}
      {successModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center">
                <BadgeCheck size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-heading">Success</h3>
                <p className="text-sm text-gray-600 mt-2">{successMessage}</p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setSuccessModal(false)} className="btn-primary px-4 py-2">OK</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Patient Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-heading">Add New Patient</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">{formError}</div>
              )}
              <div>
                <label className="input-label">Full Name *</label>
                <input type="text" placeholder="Jane Doe" value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Email *</label>
                <input type="email" placeholder="patient@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Phone</label>
                  <input type="text" placeholder="0123456789" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="input-label">Date of Birth</label>
                  <DatePicker
                    maxDate={new Date()}
                    value={form.dob}
                    onChange={(val) => setForm({ ...form, dob: val })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field appearance-none">
                    <option value="">Select…</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Adding…" : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Patient detail side drawer ──────────────────── */
function PatientDrawer({ patient, onClose, onDelete }) {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab]                   = useState("info");
  const [loadingAppts, setLoadingAppts] = useState(false);

  useEffect(() => {
    if (tab === "appointments" && appointments.length === 0) {
      setLoadingAppts(true);
      searchAppointments({ patientId: patient.id })
        .then((r) => setAppointments(r.data ?? []))
        .catch(() => {})
        .finally(() => setLoadingAppts(false));
    }
  }, [tab]);

  const apptStats = useMemo(() => ({
    total:     appointments.length,
    completed: appointments.filter((a) => a.status === "Completed").length,
    upcoming:  appointments.filter((a) => a.status === "Confirmed" || a.status === "Pending").length,
  }), [appointments]);

  const idx = patient.id % 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-y-auto flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-lg text-heading">Patient Profile</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(patient)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} /> Delete
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Patient card */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 ${AVATAR_COLORS[idx]}`}>
              {initials(patient.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-extrabold text-heading">{patient.fullName}</h4>
              {patient.gender && <p className="text-sm text-gray-500">{patient.gender}</p>}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Mail size={12} />{patient.email}</span>
                {patient.phone && <span className="flex items-center gap-1"><Phone size={12} />{patient.phone}</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <MiniStat label="Blood Type" value={patient.bloodType || "—"} />
            <MiniStat label="Date of Birth" value={fmtDate(patient.dateOfBirth)} small />
            <MiniStat label="Joined" value={fmtDate(patient.createdAt)} small />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 shrink-0">
          {[["info", "Info"], ["appointments", "Appointments"]].map(([k, l]) => (
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
            <div className="space-y-1">
              <InfoRow label="Full Name"    value={patient.fullName} />
              <InfoRow label="Email"        value={patient.email} />
              <InfoRow label="Phone"        value={patient.phone || "Not set"} />
              <InfoRow label="Gender"       value={patient.gender || "Not set"} />
              <InfoRow label="Date of Birth" value={fmtDate(patient.dateOfBirth)} />
              <InfoRow label="Blood Type"   value={patient.bloodType || "Not set"} />
              <InfoRow label="Address"      value={patient.address || "Not set"} />
              <InfoRow label="Joined"       value={fmtDate(patient.createdAt)} />
              {patient.emergencyContact && (
                <InfoRow label="Emergency Contact" value={patient.emergencyContact} />
              )}
              {patient.allergies && (
                <InfoRow label="Allergies" value={patient.allergies} />
              )}
            </div>
          )}

          {tab === "appointments" && (
            loadingAppts ? <Spinner /> :
            appointments.length === 0 ? (
              <Empty icon={Calendar} text="No appointments found" />
            ) : (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <MiniStat label="Total"     value={apptStats.total} />
                  <MiniStat label="Completed" value={apptStats.completed} />
                  <MiniStat label="Upcoming"  value={apptStats.upcoming} />
                </div>
                <div className="space-y-1">
                  {appointments.slice(0, 20).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-heading truncate">{a.doctor}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={11} />{a.date}
                          <span className="ml-1">{a.time}</span>
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${badgeStatus[a.status] || "bg-gray-100 text-gray-500"}`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shared small components ─────────────────────── */
function StatMini({ icon: Icon, color, label, value }) {
  const colors = {
    brand:  "bg-brand-50 text-brand-500",
    mint:   "bg-mint-50 text-mint-500",
    purple: "bg-purple-50 text-purple-600",
    red:    "bg-red-50 text-red-500",
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

function ConfirmDelete({ name, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="font-bold text-lg text-heading mb-1">Delete Patient?</h3>
        <p className="text-sm text-gray-500 mb-5">
          Are you sure you want to remove <span className="font-semibold text-gray-700">{name}</span>? All associated data will be permanently deleted.
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
