import { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle } from "lucide-react";

export default function FileUploadZone({
  onUpload,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  label = "Drop files here or click to upload",
  sublabel,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setError("");
    setUploadedFile(null);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    // Validate type
    const ext = "." + file.name.split(".").pop().toLowerCase();
    const allowed = accept.split(",").map((s) => s.trim());
    if (!allowed.includes(ext)) {
      setError(`Invalid file type. Allowed: ${accept}`);
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
      setUploadedFile(file.name);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer
          transition-colors duration-200
          ${dragOver
            ? "border-brand-500 bg-brand-50"
            : "border-gray-300 bg-white hover:border-brand-400"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center animate-pulse">
              <Upload size={24} className="text-brand-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Uploading...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-mint-50 flex items-center justify-center">
              <CheckCircle size={24} className="text-mint-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {uploadedFile} uploaded!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFile(null);
              }}
              className="text-xs text-brand-500 font-semibold hover:underline"
            >
              Upload another
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
              <Upload size={24} className="text-brand-500" />
            </div>
            <p className="text-[15px] font-semibold text-heading">{label}</p>
            <p className="text-sm text-gray-500">
              {sublabel || `Supports ${accept.replace(/\./g, "").toUpperCase()} up to ${maxSizeMB}MB`}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">
          <X size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
