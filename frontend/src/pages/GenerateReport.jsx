import { useState, lazy, Suspense } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FileText, Plus, X, Eye } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { generateMedicalReport } from "../services/medicalReportService";
import { generateStyledPDF } from "../utils/generateStyledPDF";
import DatePicker from "../components/DatePicker";

const ReportPreviewModal = lazy(
  () => import("../components/ReportPreviewModal"),
);

export default function GenerateReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const appt = location.state || {};

  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    diagnosis: "",
    symptoms: "",
    treatment: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    notes: "",
    followUpDate: "",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setMed = (idx, key, val) => {
    const meds = [...form.medications];
    meds[idx] = { ...meds[idx], [key]: val };
    set("medications", meds);
  };

  const addMed = () =>
    set("medications", [
      ...form.medications,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);

  const removeMed = (idx) =>
    set(
      "medications",
      form.medications.filter((_, i) => i !== idx),
    );

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await generateMedicalReport(id, form);

      generateStyledPDF(form, appt, id);

      setPreview(false);
      navigate("/appointments", { state: { reportGenerated: true } });
    } catch (err) {
      console.error("FRONTEND CRASH REPORT:", err);
      alert(err.response?.data?.message || "Failed to generate report.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Generate Medical Report"
        subtitle={
          appt.patient ? `Patient: ${appt.patient}` : `Appointment #${id}`
        }
      />

      {/* Appointment context card */}
      {appt.patient && (
        <div className="card-padded flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
            <FileText size={20} className="text-brand-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-heading">{appt.patient}</p>
            <p className="text-xs text-gray-500">
              {appt.date} · {appt.time} · {appt.specialty}
            </p>
          </div>
          <span className="badge-completed">Completed</span>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Diagnosis & Symptoms */}
        <div className="card-padded mb-5">
          <h3 className="text-sm font-bold text-heading mb-4">Diagnosis</h3>
          <div className="space-y-4">
            <div>
              <label className="input-label">Diagnosis</label>
              <input
                value={form.diagnosis}
                onChange={(e) => set("diagnosis", e.target.value)}
                className="input-field"
                placeholder="e.g. Acute Upper Respiratory Infection"
                required
              />
            </div>
            <div>
              <label className="input-label">Symptoms</label>
              <textarea
                value={form.symptoms}
                onChange={(e) => set("symptoms", e.target.value)}
                className="input-field min-h-[80px] resize-y"
                placeholder="e.g. Fever, cough, sore throat for 3 days"
                rows={3}
              />
            </div>
            <div>
              <label className="input-label">Treatment Plan</label>
              <textarea
                value={form.treatment}
                onChange={(e) => set("treatment", e.target.value)}
                className="input-field min-h-[80px] resize-y"
                placeholder="e.g. Rest, hydration, prescribed antibiotics..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="card-padded mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-heading">Medications</h3>
            <button
              type="button"
              onClick={addMed}
              className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {form.medications.map((med, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto] gap-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    value={med.name}
                    onChange={(e) => setMed(idx, "name", e.target.value)}
                    className="input-field"
                    placeholder="Medicine"
                  />
                  <input
                    value={med.dosage}
                    onChange={(e) => setMed(idx, "dosage", e.target.value)}
                    className="input-field"
                    placeholder="Dosage"
                  />
                  <input
                    value={med.frequency}
                    onChange={(e) => setMed(idx, "frequency", e.target.value)}
                    className="input-field"
                    placeholder="Frequency"
                  />
                  <input
                    value={med.duration}
                    onChange={(e) => setMed(idx, "duration", e.target.value)}
                    className="input-field"
                    placeholder="Duration"
                  />
                </div>
                {form.medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMed(idx)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors self-center"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes & Follow-up */}
        <div className="card-padded mb-6">
          <h3 className="text-sm font-bold text-heading mb-4">Additional</h3>
          <div className="space-y-4">
            <div>
              <label className="input-label">Doctor Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                className="input-field min-h-[80px] resize-y"
                placeholder="Any additional observations or instructions..."
                rows={3}
              />
            </div>
            <div className="max-w-xs">
              <label className="input-label">Follow-up Date (optional)</label>
              <DatePicker
                minDate={new Date()}
                value={form.followUpDate}
                onChange={(val) => set("followUpDate", val)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!form.diagnosis}
            onClick={() => setPreview(true)}
            className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Eye size={16} />
            Preview & Generate
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>

      {preview && (
        <Suspense fallback={null}>
          <ReportPreviewModal
            form={form}
            appt={appt}
            onClose={() => setPreview(false)}
            onConfirm={handleConfirm}
            saving={saving}
          />
        </Suspense>
      )}
    </div>
  );
}
