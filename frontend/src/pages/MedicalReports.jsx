import { useState, useEffect } from "react";
import { FileText, Eye, Trash2 } from "lucide-react";
import { getMyReports, deleteReport, uploadMedicalReport } from "../services/uploadService";
import { mockReports, isDev, isDevToken } from "../dev/mockData";
import PageHeader from "../components/PageHeader";
import FileUploadZone from "../components/FileUploadZone";

export default function MedicalReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    if (isDev && isDevToken()) {
      setReports(mockReports);
      setLoading(false);
      return;
    }
    getMyReports()
      .then((res) => setReports(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleUpload = async (file) => {
    await uploadMedicalReport(file);
    fetchReports(); // Refresh list after upload
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete report.");
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "–";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <PageHeader
        title="Medical Reports"
        subtitle="Upload and manage your medical documents"
      />

      {/* Upload zone */}
      <div className="mb-6">
        <FileUploadZone
          onUpload={handleUpload}
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeMB={10}
        />
      </div>

      {/* Reports list */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-heading">Uploaded Files</h3>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No medical reports uploaded yet.
          </div>
        ) : (
          <div>
            {reports.map((report, i) => (
              <div
                key={report.id}
                className={`flex items-center gap-3.5 px-6 py-3.5 ${
                  i < reports.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {/* File icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    report.fileType?.includes("pdf")
                      ? "bg-red-50"
                      : "bg-brand-50"
                  }`}
                >
                  <FileText
                    size={18}
                    className={
                      report.fileType?.includes("pdf")
                        ? "text-red-500"
                        : "text-brand-500"
                    }
                  />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-heading truncate">
                    {report.fileName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(report.uploadedAt).toLocaleDateString()} ·{" "}
                    {formatSize(report.fileSize)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {report.fileUrl && (
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline flex items-center gap-1.5 text-xs px-3 py-1.5"
                    >
                      <Eye size={14} />
                      View
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
