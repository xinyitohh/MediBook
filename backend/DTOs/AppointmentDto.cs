namespace backend.DTOs
{
    public class CreateAppointmentDto
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string AppointmentType { get; set; } = "In-person";
    }

    public class AppointmentResponseDto
    {
        public int Id { get; set; }
        public string Doctor { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string Patient { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string DoctorNotes { get; set; } = string.Empty;
        public string AppointmentType { get; set; } = string.Empty;
        public string CancellationReason { get; set; } = string.Empty;

        //public string? PatientReportUrl { get; set; }
    }

    public class CompleteAppointmentDto
    {
        public string DoctorNotes { get; set; } = string.Empty;
    }
}
