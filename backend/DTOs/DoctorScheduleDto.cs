namespace backend.DTOs
{
    // Response — what the frontend receives
    public class DoctorScheduleDto
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int DayOfWeek { get; set; }        // 0=Sun, 1=Mon, ..., 6=Sat
        public string DayName { get; set; } = string.Empty;  // "Monday", "Tuesday", etc.
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int SlotDurationMinutes { get; set; }
        public bool IsActive { get; set; }
    }

    // Request — when doctor/admin creates or updates a schedule
    public class CreateDoctorScheduleDto
    {
        public int DayOfWeek { get; set; }
        public string StartTime { get; set; } = "09:00";
        public string EndTime { get; set; } = "17:00";
        public int SlotDurationMinutes { get; set; } = 30;
        public bool IsActive { get; set; } = true;
    }

    // Request — update existing schedule
    public class UpdateDoctorScheduleDto
    {
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int SlotDurationMinutes { get; set; }
        public bool IsActive { get; set; }
    }

    // Response — available time slots for a specific date
    public class AvailableSlotsDto
    {
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string DayName { get; set; } = string.Empty;
        public List<string> AvailableSlots { get; set; } = new();
        public List<string> BookedSlots { get; set; } = new();
    }
}