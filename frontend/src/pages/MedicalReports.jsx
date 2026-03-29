import { useState, useEffect } from "react";
import { FileText, Eye, Trash2, Download } from "lucide-react";
import { getMyReports, deleteReport, uploadMedicalReport, getMyAppointments } from "../services";
import { mockReports, isDev, isDevToken } from "../dev/mockData";
import { generateStyledPDF } from "../utils/generateStyledPDF";
import PageHeader from "../components/PageHeader";
import FileUploadZone from "../components/FileUploadZone";

export default function MedicalReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

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
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    const handleUpload = async (file) => {
        setIsUploading(true);
        setUploadProgress(0); // Start the progress bar at 0%

        try {
            // We pass the file, an empty string for the description, 
            // and the callback to update the progress bar state
            await uploadMedicalReport(file, "", (progress) => {
                setUploadProgress(progress);
            });

            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);

                fetchReports();
            }, 800);

        } catch (error) {
            console.error("Upload failed", error);
            setIsUploading(false);

            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to upload the document. Please try again.");
            }
        }
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

    const reportWrittenByDoctor = reports.filter(r => r.uploadedByRole === "Doctor");

    const myUploads = reports.filter(r => r.uploadedByRole === "Patient");

    const handleDownload = async (reportId, appointmentId) => {
        try {
            //Find the specific report data from your state to use as the "form"
            const rawReportData = reportWrittenByDoctor.find(r => r.id === reportId);

            if (!rawReportData) {
                alert("Report data not found.");
                return;
            }

            let parsedMedications = [];
            try {
                if (typeof rawReportData.medications === 'string' && rawReportData.medications.trim() !== '') {
                    parsedMedications = JSON.parse(rawReportData.medications);
                } else if (Array.isArray(rawReportData.medications)) {
                    // Just in case it's already an array somehow
                    parsedMedications = rawReportData.medications;
                }
            } catch (parseError) {
                console.error("Could not parse medications data:", parseError);
                parsedMedications = []; 
            }

            // Create a clean payload object for the PDF generator
            const pdfPayload = {
                ...rawReportData,               // Copy all the normal fields (diagnosis, etc.)
                medications: parsedMedications  
            };

            // Force all the C# capitalized properties to be lowercase
            const standardizedMedications = (pdfPayload.medications || []).map(med => ({               
                name: med.name || med.Name || "",
                dosage: med.dosage || med.Dosage || "",
                frequency: med.frequency || med.Frequency || "",
                duration: med.duration || med.Duration || ""
            }));

            const finalPayload = {
                ...pdfPayload,
                medications: standardizedMedications
            };

            console.log(finalPayload.medications );
            const apptResponse = await getMyAppointments();
            const allAppointments = apptResponse.data;
            const apptDetails = allAppointments.find((a) => a.id === appointmentId);

            if (!apptDetails) {
                alert("Could not find the appointment details for this report.");
                return;
            }

            generateStyledPDF(finalPayload, apptDetails, appointmentId);

        } catch (err) {
            console.error("Error generating PDF:", err);
            alert("Could not generate the report. Please try again.");
        }
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
                    isUploading={isUploading}       
                    uploadProgress={uploadProgress}
                />
            </div>

            {/* TABLE 1: Medical Reports (From Doctor) */}
            <div className="card mb-6">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-heading">Medical Reports</h3>
                    <p className="text-xs text-gray-500 mt-1">Reports provided by your doctor</p>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-400">Loading...</div>
                ) : reportWrittenByDoctor.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                        No medical reports available yet.
                    </div>
                ) : (
                    <div>
                        {reportWrittenByDoctor.map((report, i) => (
                            <div
                                key={report.id}
                                className={`flex items-center gap-3.5 px-6 py-3.5 ${i < reportWrittenByDoctor.length - 1 ? "border-b border-gray-100" : ""
                                    }`}
                            >
                                {/* File icon */}
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${report.fileType?.includes("pdf")
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
                                        {new Date(report.uploadedAt).toLocaleDateString()}                                      
                                    </p>
                                </div>
                            
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDownload(report.id, report.appointmentId)}
                                        className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
                                    >
                                        <Download size={14} />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* TABLE 2: MY UPLOADS (From Patient)*/}
            <div className="card">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-heading">My Uploaded Files</h3>
                    <p className="text-xs text-gray-500 mt-1">Document uploaded</p>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-400">Loading...</div>
                ) : myUploads.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                        You haven't uploaded any medical reports yet.
                    </div>
                ) : (
                    <div>
                        {myUploads.map((report, i) => (
                            <div
                                key={report.id}
                                className={`flex items-center gap-3.5 px-6 py-3.5 ${i < myUploads.length - 1 ? "border-b border-gray-100" : ""
                                    }`}
                            >
                                {/* File icon */}
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${report.fileType?.includes("pdf")
                                        ? "bg-red-50"
                                        : "bg-gray-50"
                                        }`}
                                >
                                    <FileText
                                        size={18}
                                        className={
                                            report.fileType?.includes("pdf")
                                                ? "text-red-500"
                                                : "text-gray-500"
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

                                {/* Actions: View and Delete */}
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
