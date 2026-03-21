using backend.Models;

public class DoctorSchedule
{
    public int Id { get; set; }
    public int DoctorId { get; set; }
    public int DayOfWeek { get; set; }

    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "17:00";

    public string? BreakStart { get; set; }  // NEW
    public string? BreakEnd { get; set; }    // NEW

    public int SlotDurationMinutes { get; set; } = 30;
    public bool IsActive { get; set; } = true;

    public Doctor Doctor { get; set; } = null!;
}