namespace backend.Models
{
    public class MedicalReport
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int? AppointmentId { get; set; } // null for uploaded reports, set for generated reports
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty; // e.g. "application/pdf"
        public long FileSize { get; set; } = 0;
        public string FileUrl { get; set; } = string.Empty; // S3 URL or local path
        public string Description { get; set; } = string.Empty;

        // Generated report fields (used when doctor generates a report)
        public string Diagnosis { get; set; } = string.Empty;
        public string Symptoms { get; set; } = string.Empty;
        public string Treatment { get; set; } = string.Empty;
        public string Medications { get; set; } = string.Empty; // JSON string
        public string Notes { get; set; } = string.Empty;
        public string FollowUpDate { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public string UploadedByRole { get; set; } = "Patient";

        // Navigation properties
        public Patient Patient { get; set; } = null!;
        public Appointment? Appointment { get; set; }
    }
}
