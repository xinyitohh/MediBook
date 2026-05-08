import { useState, lazy, Suspense, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FileText, Plus, X, Eye, Sparkles, Brain, Loader2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { generateReport, getSecurePatientReportUrl, analyzeReport, getReportAnalysis } from "../services/medicalService";
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

  const [reportUrl, setReportUrl] = useState(null);
  const [reportFileType, setReportFileType] = useState(null);
  const [medicalReportId, setMedicalReportId] = useState(null);
  const [loadingReports, setLoadingReports] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [viewingPdfUrl, setViewingPdfUrl] = useState(null);

  useEffect(() => {
    if (appt.patient) {
      setLoadingReports(true);
      getSecurePatientReportUrl(id)
        .then(res => {
          if (res.data && res.data.secureUrl) {
             setReportUrl(res.data.secureUrl);
             setReportFileType(res.data.fileType);
             
             if (res.data.medicalReportId) {
                setMedicalReportId(res.data.medicalReportId);
                // Attempt to fetch existing analysis using the real medicalReportId
                getReportAnalysis(res.data.medicalReportId).then(analysisRes => {
                    setAnalysisData(analysisRes.data);
                }).catch(() => {});
             }
          }
        })
        .catch(err => console.error("No patient report found:", err))
        .finally(() => setLoadingReports(false));
    }
  }, [id, appt.patient]);

  const pollAnalysis = (reportId) => {
    const interval = setInterval(async () => {
      try {
        const res = await getReportAnalysis(reportId);
        if (res.data.status === "Completed" || res.data.status === "Failed") {
          setAnalysisData(res.data);
          clearInterval(interval);
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 3000);
  };

  const handleAnalyze = async () => {
    if (!medicalReportId) {
       alert("No medical report ID available to analyze.");
       return;
    }
    setAnalyzing(true);
    try {
      const res = await analyzeReport(medicalReportId);
      setAnalysisData(res.data);
      if (res.data.status === "Processing") {
        pollAnalysis(medicalReportId);
      }
    } catch (err) {
      alert("Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleViewPdf = () => {
    setViewingPdfUrl(reportUrl);
  };

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
      await generateReport(id, form);

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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Left Column: Form */}
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

      {/* Right Column: Patient Reports & AI Analysis */}
      {appt.patient && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-6">
            <div className="flex flex-col mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="text-brand-500" size={20} />
                Patient Reports
              </h3>
              <p className="text-sm text-gray-500">
                Uploaded by {appt.patient}
              </p>
            </div>

            {loadingReports ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin text-brand-500" size={24} />
              </div>
            ) : !reportUrl ? (
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500">No medical reports uploaded by the patient for this appointment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            Patient Uploaded Report
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleViewPdf}
                          className="btn-outline py-1.5 px-3 text-xs font-semibold whitespace-nowrap"
                        >
                          <Eye size={14} className="mr-1 inline" /> View PDF
                        </button>
                    </div>

                    {/* AI Analysis Section */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100/50">
                        <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={14} className="text-indigo-500" />
                            AI Analysis
                        </h4>
                        </div>
                        
                        {analysisData ? (
                        <div className="space-y-4">
                            {analysisData.status === "Processing" ? (
                            <div className="flex items-center gap-2 text-indigo-600 text-sm py-2">
                                <Loader2 size={16} className="animate-spin" />
                                Analyzing report with AI...
                            </div>
                            ) : analysisData.status === "Failed" ? (
                            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                                {analysisData.summary || "Analysis failed."}
                            </div>
                            ) : (
                            <>
                                <div className="prose prose-sm prose-indigo max-w-none text-gray-700 text-sm whitespace-pre-wrap">
                                {analysisData.summary}
                                </div>
                                
                                {(() => {
                                try {
                                    const meds = JSON.parse(analysisData.normalFindings || "[]");
                                    if (meds.length > 0) {
                                    return (
                                        <div className="mt-3">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Medications</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {meds.map((med, i) => (
                                            <span key={i} className="bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
                                                {med}
                                            </span>
                                            ))}
                                        </div>
                                        </div>
                                    );
                                    }
                                } catch(e) {}
                                return null;
                                })()}

                                {(() => {
                                try {
                                    const findings = JSON.parse(analysisData.abnormalFindings || "[]");
                                    if (findings.length > 0) {
                                    return (
                                        <div className="mt-3">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Key Findings</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {findings.map((f, i) => (
                                            <span key={i} className="bg-red-50 border border-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                                                {f}
                                            </span>
                                            ))}
                                        </div>
                                        </div>
                                    );
                                    }
                                } catch(e) {}
                                return null;
                                })()}
                            </>
                            )}
                        </div>
                        ) : (
                        <div className="text-center py-2">
                            <p className="text-xs text-gray-500 mb-3">
                            Extract conditions, medications, and a concise summary from this report.
                            </p>
                            <button
                            type="button"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="w-full btn-primary bg-indigo-600 hover:bg-indigo-700 py-2 text-sm font-semibold shadow-indigo-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                            {analyzing ? (
                                <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
                            ) : (
                                <><Brain size={16} /> Analyze Report</>
                            )}
                            </button>
                        </div>
                        )}
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewingPdfUrl && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-semibold text-lg text-gray-900">Medical Report</h3>
                    <button
                        onClick={() => setViewingPdfUrl(null)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 bg-gray-100 p-4 relative">
                    {viewingPdfUrl.includes(".pdf") || viewingPdfUrl.includes("response-content-type=application%2Fpdf") ? (
                        <iframe
                            src={viewingPdfUrl}
                            className="w-full h-full rounded-lg border-0 bg-white shadow-sm"
                            title="PDF Viewer"
                        />
                    ) : (
                        <img
                            src={viewingPdfUrl}
                            alt="Medical Report"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
