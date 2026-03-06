import { X, Send } from "lucide-react";

const Section = ({ title, children }) => (
  <div className="mb-5">
    <div className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1.5 px-1">{title}</div>
    <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">{children}</div>
  </div>
);

export default function ReportPreviewModal({ form, appt, onClose, onConfirm, saving }) {
  const meds = form.medications?.filter((m) => m.name?.trim());
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-3xl h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-heading">Report Preview</h2>
            <p className="text-xs text-gray-400 mt-0.5">Review before submitting to backend</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onConfirm}
              disabled={saving}
              className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              {saving ? "Generating..." : "Confirm & Submit"}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Report header */}
          <div className="flex items-center justify-between mb-6 pb-5 border-b-2 border-brand-500">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-500 to-mint-500 flex items-center justify-center font-extrabold text-white text-base">M</div>
              <span className="font-extrabold text-lg text-heading">MediBook</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-brand-500 text-lg">Medical Report</p>
              <p className="text-xs text-gray-400 mt-0.5">Generated: {date}</p>
            </div>
          </div>

          {/* Patient info row */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Patient", value: appt.patient },
              { label: "Doctor", value: appt.doctor || "—" },
              { label: "Date", value: appt.date },
              { label: "Specialty", value: appt.specialty },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm font-semibold text-heading truncate">{value || "—"}</p>
              </div>
            ))}
          </div>

          {form.diagnosis && <Section title="Diagnosis">{form.diagnosis}</Section>}
          {form.symptoms && <Section title="Symptoms">{form.symptoms}</Section>}
          {form.treatment && <Section title="Treatment Plan">{form.treatment}</Section>}

          {meds?.length > 0 && (
            <div className="mb-5">
              <div className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1.5 px-1">Prescribed Medications</div>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-4 bg-brand-500 px-4 py-2">
                  {["Medicine", "Dosage", "Frequency", "Duration"].map((h) => (
                    <span key={h} className="text-[11px] font-bold text-white">{h}</span>
                  ))}
                </div>
                {meds.map((med, i) => (
                  <div key={i} className={`grid grid-cols-4 px-4 py-2.5 text-sm ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}>
                    <span className="font-medium text-heading">{med.name || "—"}</span>
                    <span className="text-gray-600">{med.dosage || "—"}</span>
                    <span className="text-gray-600">{med.frequency || "—"}</span>
                    <span className="text-gray-600">{med.duration || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.notes && <Section title="Doctor Notes">{form.notes}</Section>}

          {form.followUpDate && (
            <div className="flex items-center gap-2 px-4 py-3 bg-mint-50 rounded-xl border-l-4 border-mint-500">
              <span className="text-sm font-bold text-mint-600">Follow-up: {form.followUpDate}</span>
            </div>
          )}

          <p className="text-center text-xs text-gray-300 mt-8">This document is confidential and intended for the patient only.</p>
        </div>
      </div>
    </div>
  );
}
