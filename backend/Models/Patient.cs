namespace backend.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty; // links to User
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string ProfileImageUrl { get; set; } = string.Empty; // S3 URL
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // NEW
        public string BloodType { get; set; } = string.Empty;
        public string Allergies { get; set; } = string.Empty;        // comma-separated or JSON
        public string ChronicConditions { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;

        // Navigation property
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<MedicalReport> MedicalReports { get; set; } = new List<MedicalReport>();
    }
}