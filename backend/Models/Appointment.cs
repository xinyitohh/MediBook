namespace backend.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty; // e.g. "09:00 AM"
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Completed, Cancelled
        public string Notes { get; set; } = string.Empty;
        public string DoctorNotes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // NEW
        public string AppointmentType { get; set; } = "In-person";  // "In-person" or "Teleconsultation"
        public string CancellationReason { get; set; } = string.Empty;

        // Navigation properties
        public Patient Patient { get; set; } = null!;
        public Doctor Doctor { get; set; } = null!;
    }
}
