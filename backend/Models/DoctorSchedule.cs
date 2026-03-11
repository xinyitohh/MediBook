namespace backend.Models
{
    public class DoctorSchedule
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int DayOfWeek { get; set; }        // 0=Sunday, 1=Monday, ..., 6=Saturday
        public string StartTime { get; set; } = "09:00";  // 24hr format
        public string EndTime { get; set; } = "17:00";
        public int SlotDurationMinutes { get; set; } = 30;
        public bool IsActive { get; set; } = true;

        // Navigation
        public Doctor Doctor { get; set; } = null!;
    }
}